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
  && typeof value.kidId === 'string' && typeof value.awardId === 'string';

export function parseLocalPreview(value: unknown) {
  if (!object(value) || !Array.isArray(value.kids) || !value.kids.every(kid)
    || !Array.isArray(value.awards) || !value.awards.every(award)
    || !Array.isArray(value.associations) || !value.associations.every(association)) {
    throw new Error('Invalid local preview');
  }
  const kids = prepareKids(value.kids);
  return { kids, groups: resolveAwardGroups(kids, value.awards, value.associations) };
}
