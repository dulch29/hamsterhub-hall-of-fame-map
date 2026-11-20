import type { Kid, Project } from '../types';
import { PROVINCE_CODES } from '../types';
import { prepareKids } from './prepareKids';
import { resolveAwardGroups, type AwardAssociation, type DemoAward } from './demoAwards';

const object = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;
const textOrNull = (value: unknown) => value === null || typeof value === 'string';
const project = (value: unknown): value is Project => object(value)
  && ['id', 'title', 'shortDescription', 'url', 'createdAt'].every((key) => typeof value[key] === 'string')
  && textOrNull(value.thumbnailUrl);
const kid = (value: unknown): value is Kid => object(value)
  && ['id', 'displayName', 'profileUrl'].every((key) => typeof value[key] === 'string')
  && ['nickname', 'fullName'].every((key) => value[key] === undefined || typeof value[key] === 'string')
  && PROVINCE_CODES.includes(value.province as Kid['province'])
  && typeof value.showOnMap === 'boolean' && textOrNull(value.avatarUrl) && textOrNull(value.featuredProjectId)
  && Array.isArray(value.projects) && value.projects.every(project);
const award = (value: unknown): value is DemoAward => object(value)
  && typeof value.id === 'string' && typeof value.title === 'string'
  && (value.logoUrl === undefined || typeof value.logoUrl === 'string')
  && ['trophy', 'gold', 'silver', 'bronze'].includes(value.style as string);
const association = (value: unknown): value is AwardAssociation => object(value)
  && typeof value.kidId === 'string' && typeof value.awardId === 'string'
  && (value.featured === undefined || typeof value.featured === 'boolean')
  && (value.priority === undefined || (Number.isSafeInteger(value.priority) && (value.priority as number) >= 0))
  && (value.projectId === undefined || textOrNull(value.projectId))
  && (value.presentationUrl === undefined || typeof value.presentationUrl === 'string')
  && (value.slides === undefined || (Array.isArray(value.slides) && value.slides.every((slide) => object(slide)
    && typeof slide.url === 'string' && typeof slide.alt === 'string')));

export type PreviewMedia = { portraitUrl?: string; presentationUrl?: string; fictional?: boolean };
const previewMedia = (value: unknown): value is PreviewMedia => object(value) && !Array.isArray(value)
  && ['portraitUrl', 'presentationUrl'].every((key) => value[key] === undefined || typeof value[key] === 'string')
  && (value.fictional === undefined || typeof value.fictional === 'boolean');

export function parseLocalPreview(value: unknown) {
  if (!object(value) || !Array.isArray(value.kids) || !value.kids.every(kid)
    || !Array.isArray(value.awards) || !value.awards.every(award)
    || !Array.isArray(value.associations) || !value.associations.every(association)
    || (value.previews !== undefined && (!object(value.previews) || Array.isArray(value.previews)
      || !Object.values(value.previews).every(previewMedia)))) {
    throw new Error('Invalid local preview');
  }
  const kids = prepareKids(value.kids);
  const visible = new Set(kids.map((kid) => kid.id));
  const previews = Object.fromEntries(Object.entries(value.previews ?? {})
    .filter((entry): entry is [string, PreviewMedia] => visible.has(entry[0]) && previewMedia(entry[1]))
    .map(([id, media]) => [id, { portraitUrl: media.portraitUrl, presentationUrl: media.presentationUrl, fictional: media.fictional }]));
  return { kids, groups: resolveAwardGroups(kids, value.awards, value.associations), previews };
}
