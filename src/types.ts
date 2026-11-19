export const PROVINCE_CODES = [
  'TH-10', 'TH-11', 'TH-12', 'TH-13', 'TH-14', 'TH-15', 'TH-16', 'TH-17',
  'TH-18', 'TH-19', 'TH-20', 'TH-21', 'TH-22', 'TH-23', 'TH-24', 'TH-25',
  'TH-26', 'TH-27', 'TH-30', 'TH-31', 'TH-32', 'TH-33', 'TH-34', 'TH-35',
  'TH-36', 'TH-37', 'TH-38', 'TH-39', 'TH-40', 'TH-41', 'TH-42', 'TH-43',
  'TH-44', 'TH-45', 'TH-46', 'TH-47', 'TH-48', 'TH-49', 'TH-50', 'TH-51',
  'TH-52', 'TH-53', 'TH-54', 'TH-55', 'TH-56', 'TH-57', 'TH-58', 'TH-60',
  'TH-61', 'TH-62', 'TH-63', 'TH-64', 'TH-65', 'TH-66', 'TH-67', 'TH-70',
  'TH-71', 'TH-72', 'TH-73', 'TH-74', 'TH-75', 'TH-76', 'TH-77', 'TH-80',
  'TH-81', 'TH-82', 'TH-83', 'TH-84', 'TH-85', 'TH-86', 'TH-90', 'TH-91',
  'TH-92', 'TH-93', 'TH-94', 'TH-95', 'TH-96',
] as const;

export type ProvinceCode = (typeof PROVINCE_CODES)[number];

export type Project = {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  shortDescription: string;
  url: string;
  createdAt: string;
};

export type Kid = {
  id: string;
  displayName: string;
  nickname?: string;
  fullName?: string;
  avatarUrl: string | null;
  province: ProvinceCode;
  showOnMap: boolean;
  profileUrl: string;
  projects: Project[];
  featuredProjectId: string | null;
  featuredProject: Project | null;
};

export type MapPin = {
  kidId: string;
  position: { lng: number; lat: number };
};
