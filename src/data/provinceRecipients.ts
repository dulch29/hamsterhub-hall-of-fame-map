import type { Kid } from "../types";
import type { AwardGroup, RecipientAward } from "./demoAwards";

export type ProvinceRecipient = { kid: Kid; featuredCompetition: RecipientAward | null };

export function provinceRecipients(group: AwardGroup): ProvinceRecipient[] {
  const rows = new Map<string, ProvinceRecipient>();
  for (const award of group.awards) {
    for (const kid of award.recipients) {
      if (kid.showOnMap !== true || kid.province !== group.province || rows.has(kid.id)) continue;
      const featuredId = group.featuredAwardIds?.[kid.id];
      const featuredCompetition = group.awards.find((entry) => entry.id === featuredId
        && entry.recipients.some((recipient) => recipient.id === kid.id && recipient.showOnMap === true)) ?? null;
      rows.set(kid.id, { kid, featuredCompetition });
    }
  }
  return [...rows.values()];
}
