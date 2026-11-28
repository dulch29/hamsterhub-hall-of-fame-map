import { PROVINCE_CODES, type Kid, type Project, type ProvinceCode } from '../src/types.js';
import { prepareKids } from '../src/data/prepareKids.js';
import {
  resolveAwardGroups,
  type AwardAssociation,
  type AwardGroup,
  type DemoAward,
  type PresentationSlide,
} from '../src/data/demoAwards.js';
import { provinceNames } from '../src/geo/provinces.js';

export type SheetHallOfFameData = {
  kids: Kid[];
  groups: AwardGroup[];
};

const MAX_CSV_BYTES = 2 * 1024 * 1024;
const VALID_STYLES = new Set<DemoAward['style']>(['trophy', 'gold', 'silver', 'bronze']);

const PROVINCE_LOOKUP = (() => {
  const map = new Map<string, ProvinceCode>();
  for (const code of PROVINCE_CODES) {
    map.set(code.toLowerCase(), code);
    const name = provinceNames[code];
    if (name) map.set(name.toLowerCase(), code);
  }
  return map;
})();

/**
 * RFC 4180 CSV parser supporting quoted fields, embedded commas, escaped quotes (""), and CRLF/LF.
 */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  const clean = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;

  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i]!;
    if (inQuotes) {
      if (ch === '"') {
        if (clean[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\r') {
      if (clean[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (ch === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += ch;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function parseBool(value: string | undefined): boolean {
  if (!value) return false;
  return ['true', '1', 'yes', 'y'].includes(value.trim().toLowerCase());
}

function resolveProvince(value: string | undefined): ProvinceCode | null {
  if (!value) return null;
  return PROVINCE_LOOKUP.get(value.trim().toLowerCase()) ?? null;
}

function parseSlides(value: string | undefined, title: string, posterUrl?: string | null): PresentationSlide[] {
  if (!value) return [];
  const items = value
    .split(/[\n|]+/)
    .map((item) => item.trim())
    .filter(Boolean);
  return items.map((url, index) => {
    const isVideo = /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
    return {
      url,
      alt: title ? `${title} (${index + 1})` : `Slide ${index + 1}`,
      type: isVideo ? 'video' : 'image',
      ...(isVideo && posterUrl ? { poster: posterUrl } : {}),
    };
  });
}

function normalizeHeader(header: string): string {
  return header.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Converts a flat Google Sheet CSV into validated Kid[] and AwardGroup[].
 * Rows with showOnMap !== true or invalid province codes are excluded before output.
 */
export function sheetCsvToHallOfFame(csv: string): SheetHallOfFameData {
  const rows = parseCsv(csv);
  if (rows.length < 2) return { kids: [], groups: [] };

  const headers = rows[0]!.map(normalizeHeader);
  const colIndex = new Map<string, number>();
  headers.forEach((name, idx) => {
    if (name && !colIndex.has(name)) colIndex.set(name, idx);
  });

  const cell = (row: string[], ...aliases: string[]): string => {
    for (const alias of aliases) {
      const idx = colIndex.get(alias);
      if (idx !== undefined && row[idx] !== undefined) {
        return row[idx]!.trim();
      }
    }
    return '';
  };

  const kidsMap = new Map<string, Kid>();
  const awardsMap = new Map<string, DemoAward>();
  const associations: AwardAssociation[] = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r]!;
    if (row.every((v) => !v.trim())) continue;

    const showOnMap = parseBool(cell(row, 'showonmap', 'visible', 'consent'));
    if (!showOnMap) continue;

    const kidId = cell(row, 'kidid', 'studentid', 'id');
    const province = resolveProvince(cell(row, 'province', 'provincecode'));
    if (!kidId || !province) continue;

    const nickname = cell(row, 'nickname');
    const fullName = cell(row, 'fullname', 'name');
    const displayName = cell(row, 'displayname') || fullName || nickname || kidId;
    const avatarUrl = cell(row, 'avatarurl', 'portraiturl', 'avatar') || null;
    const profileUrl = cell(row, 'profileurl', 'profile') || `https://www.hamsterhub.co/`;

    let kid = kidsMap.get(kidId);
    if (!kid) {
      kid = {
        id: kidId,
        displayName,
        ...(nickname ? { nickname } : {}),
        ...(fullName ? { fullName } : {}),
        avatarUrl,
        province,
        showOnMap: true,
        profileUrl,
        projects: [],
        featuredProjectId: null,
        featuredProject: null,
      };
      kidsMap.set(kidId, kid);
    }

    const awardTitle = cell(row, 'awardtitle', 'competition', 'award') || 'Hall of Fame Award';
    const awardId = cell(row, 'awardid') || awardTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'award';
    const rawStyle = cell(row, 'awardstyle', 'style').toLowerCase() as DemoAward['style'];
    const style: DemoAward['style'] = VALID_STYLES.has(rawStyle) ? rawStyle : 'gold';
    const awardLogoUrl = cell(row, 'awardlogourl', 'logourl') || undefined;

    if (!awardsMap.has(awardId)) {
      awardsMap.set(awardId, {
        id: awardId,
        title: awardTitle,
        style,
        ...(awardLogoUrl ? { logoUrl: awardLogoUrl } : {}),
      });
    }

    const projectTitle = cell(row, 'projecttitle', 'project');
    const projectIdInput = cell(row, 'projectid');
    const projectId = projectTitle ? (projectIdInput || `${kidId}-${awardId}-project`) : null;
    const featured = parseBool(cell(row, 'featured'));

    const thumbnailUrl = cell(row, 'projectthumbnailurl', 'thumbnailurl') || null;
    if (projectTitle && projectId && !kid.projects.some((p) => p.id === projectId)) {
      const project: Project = {
        id: projectId,
        title: projectTitle,
        thumbnailUrl,
        shortDescription: cell(row, 'projectdescription', 'description') || '',
        url: cell(row, 'projecturl') || profileUrl,
        createdAt: cell(row, 'createdat') || '2026-01-01T00:00:00.000Z',
      };
      kid.projects.push(project);
      if (featured || !kid.featuredProjectId) {
        kid.featuredProjectId = project.id;
      }
    }

    const rawPriority = cell(row, 'priority');
    const priority = rawPriority && /^\d+$/.test(rawPriority) ? Number.parseInt(rawPriority, 10) : undefined;
    const slides = parseSlides(cell(row, 'slides', 'slideurls'), projectTitle || awardTitle, thumbnailUrl);
    const presentationUrl = cell(row, 'presentationurl', 'pdfurl', 'pdf') || undefined;

    associations.push({
      kidId,
      awardId,
      ...(featured ? { featured: true } : {}),
      ...(priority !== undefined ? { priority } : {}),
      projectId,
      ...(slides.length > 0 ? { slides } : {}),
      ...(presentationUrl ? { presentationUrl } : {}),
    });
  }

  const kids = prepareKids([...kidsMap.values()]);
  const groups = resolveAwardGroups(kids, [...awardsMap.values()], associations);
  return { kids, groups };
}

export function isAllowedSheetUrl(raw: string | undefined): boolean {
  if (!raw) return false;
  try {
    const url = new URL(raw.trim());
    if (url.protocol === 'https:') return true;
    if (url.protocol === 'http:' && ['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname)) return true;
    return false;
  } catch {
    return false;
  }
}

export async function fetchSheetHallOfFame(options: {
  env?: Record<string, string | undefined>;
  fetch?: typeof fetch;
  timeoutMs?: number;
} = {}): Promise<SheetHallOfFameData | null> {
  const env = options.env ?? process.env;
  const csvUrl = env.GOOGLE_SHEET_CSV_URL?.trim();
  if (!csvUrl) return null;
  if (!isAllowedSheetUrl(csvUrl)) {
    throw new Error('INVALID_SHEET_URL');
  }

  const fetcher = options.fetch ?? fetch;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? 10_000);
  try {
    const response = await fetcher(csvUrl, {
      method: 'GET',
      signal: controller.signal,
      headers: { Accept: 'text/csv,text/plain;q=0.9,*/*;q=0.1' },
    });
    if (!response.ok) {
      await response.body?.cancel();
      throw new Error(`SHEET_HTTP_${response.status}`);
    }
    const text = await response.text();
    if (new TextEncoder().encode(text).byteLength > MAX_CSV_BYTES) {
      throw new Error('SHEET_TOO_LARGE');
    }
    return sheetCsvToHallOfFame(text);
  } finally {
    clearTimeout(timer);
  }
}
