import { PROVINCE_CODES } from '../types.js';
import type { Kid, Project, ProvinceCode } from '../types.js';

export const DEFAULT_MOCK_COUNT = 3;
export const DEFAULT_MOCK_SEED = 42;

export const MOCK_PROVINCE_NAMES: Partial<Record<ProvinceCode, string>> = {
  'TH-10': 'Bangkok',
  'TH-50': 'Chiang Mai',
  'TH-83': 'Phuket',
};

const INITIAL_PROVINCES = ['TH-10', 'TH-50', 'TH-83'] as const;
const INITIAL_NAMES = ['Mock Mali', 'Mock Niran', 'Mock Ploy'];
const PROJECT_TITLES = ['Hamster Maze', 'Space Garden', 'Ocean Explorer'];

type MockOptions = {
  count?: number;
  seed?: number;
};

export function generateMockKids({
  count = DEFAULT_MOCK_COUNT,
  seed = DEFAULT_MOCK_SEED,
}: MockOptions = {}): Kid[] {
  if (!Number.isSafeInteger(count) || count < 0 || count > 10_000) {
    throw new Error('Count must be an integer between 0 and 10000.');
  }
  if (!Number.isSafeInteger(seed)) {
    throw new Error('Seed must be a safe integer.');
  }

  let randomState = seed >>> 0;
  const random = () => {
    randomState = (Math.imul(randomState, 1664525) + 1013904223) >>> 0;
    return randomState / 4294967296;
  };

  return Array.from({ length: count }, (_, index) => {
    const id = `mock-${(seed >>> 0).toString(16)}-${String(index + 1).padStart(4, '0')}`;
    const province = INITIAL_PROVINCES[index] ?? PROVINCE_CODES[Math.floor(random() * PROVINCE_CODES.length)]!;
    const projectTitle = PROJECT_TITLES[Math.floor(random() * PROJECT_TITLES.length)]!;
    const project: Project = {
      id: `${id}-project`,
      title: projectTitle,
      thumbnailUrl: null,
      shortDescription: `A fictional student project: ${projectTitle}.`,
      url: `https://projects.example.invalid/${id}`,
      createdAt: new Date(Date.UTC(2026, 0, 1 + Math.floor(random() * 28))).toISOString(),
    };
    const projects = index === 2 ? [] : [project];

    return {
      id,
      displayName: INITIAL_NAMES[index] ?? `Mock Student ${index + 1}`,
      avatarUrl: null,
      province,
      showOnMap: true,
      profileUrl: `https://hamsterhub.example.invalid/profile/${id}`,
      projects,
      featuredProjectId: projects[0]?.id ?? null,
      featuredProject: projects[0] ?? null,
    };
  });
}
