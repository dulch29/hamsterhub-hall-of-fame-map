import type { Kid } from "../types";

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
