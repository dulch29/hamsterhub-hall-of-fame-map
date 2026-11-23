import type { Kid } from "../types";

export const TOTAL_STUDENT_AVATARS = 20;

export function getStudentAvatarUrl(avatarIndex: number): string {
  const normalized = (((avatarIndex - 1) % TOTAL_STUDENT_AVATARS) + TOTAL_STUDENT_AVATARS) % TOTAL_STUDENT_AVATARS + 1;
  return `/demo/avatars/avatar-${normalized}.png`;
}

export function pickStudentAvatar(idOrName: string): string {
  let hash = 0;
  for (let i = 0; i < idOrName.length; i++) {
    hash = (hash * 31 + idOrName.charCodeAt(i)) >>> 0;
  }
  const index = (hash % TOTAL_STUDENT_AVATARS) + 1;
  return `/demo/avatars/avatar-${index}.png`;
}

export function resolveStudentPortrait(kid: Kid, portraitUrl?: string): string | null {
  return (
    portraitUrl ??
    (kid.avatarUrl === "/demo/portrait-1.svg"
      ? "/demo/student-1.svg"
      : kid.avatarUrl === "/demo/portrait-2.svg"
        ? "/demo/student-2.svg"
        : kid.avatarUrl)
  );
}
