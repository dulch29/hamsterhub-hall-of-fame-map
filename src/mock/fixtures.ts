import type { Kid } from '../types';

export function createOptedOutKid(): Kid {
  return {
    id: 'fixture-opted-out',
    displayName: 'Mock Hidden Student',
    avatarUrl: null,
    province: 'TH-10',
    showOnMap: false,
    profileUrl: 'https://hamsterhub.example.invalid/profile/fixture-opted-out',
    projects: [],
    featuredProjectId: null,
    featuredProject: null,
  };
}

export function createLongNameKid(): Kid {
  const project = {
    id: 'fixture-long-name-project',
    title: 'Fictional Paper Garden',
    thumbnailUrl: null,
    shortDescription: 'A fictional paper garden for testing student cards.',
    url: 'https://projects.example.invalid/fixture-long-name',
    createdAt: '2026-01-01T00:00:00.000Z',
  };

  return {
    id: 'fixture-long-name',
    displayName: `Mock ${'Fictional Student With A Very Long Display Name '.repeat(5).trim()}`,
    avatarUrl: null,
    province: 'TH-50',
    showOnMap: true,
    profileUrl: 'https://hamsterhub.example.invalid/profile/fixture-long-name',
    projects: [project],
    featuredProjectId: project.id,
    featuredProject: project,
  };
}
