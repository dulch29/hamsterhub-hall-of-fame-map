import type { Kid, ProvinceCode } from "../types";

export type DemoAward = {
  id: string;
  title: string;
  style: "trophy" | "gold" | "silver" | "bronze";
  logoUrl?: string;
};
export type AwardAssociation = { kidId: string; awardId: string; featured?: boolean };
export type RecipientAward = DemoAward & { recipients: Kid[] };
export type AwardGroup = {
  id: ProvinceCode;
  province: ProvinceCode;
  leadKidId: string;
  awards: RecipientAward[];
  featuredAwardIds?: Record<string, string>;
};

export const DEMO_AWARDS: readonly DemoAward[] = [
  { id: "creative", title: "Creative Coding Award", style: "trophy" },
  { id: "maker", title: "Young Makers Challenge", style: "gold" },
  { id: "explorer", title: "Digital Explorers Competition", style: "silver" },
  { id: "ocean", title: "Ocean Innovation Challenge", style: "bronze" },
];

/** Associations describe the demo; award artwork never establishes eligibility. */
export function resolveAwardGroups(
  kids: readonly Kid[],
  definitions: readonly DemoAward[],
  associations: readonly AwardAssociation[],
): AwardGroup[] {
  const visible = new Map(kids.filter((kid) => kid.showOnMap === true).map((kid) => [kid.id, kid]));
  const groups = new Map<ProvinceCode, AwardGroup>();
  for (const definition of definitions) {
    const seen = new Set<string>();
    for (const association of associations) {
      if (association.awardId !== definition.id || seen.has(association.kidId)) continue;
      const kid = visible.get(association.kidId);
      if (!kid) continue;
      seen.add(kid.id);
      let group = groups.get(kid.province);
      if (!group) {
        group = { id: kid.province, province: kid.province, leadKidId: kid.id, awards: [] };
        groups.set(kid.province, group);
      }
      let award = group.awards.find((item) => item.id === definition.id);
      if (!award) {
        award = { ...definition, recipients: [] };
        group.awards.push(award);
      }
      award.recipients.push(kid);
    }
  }
  for (const group of groups.values()) {
    const featured = new Map<string, Set<string>>();
    for (const entry of associations) {
      if (entry.featured !== true || !group.awards.some((award) => award.id === entry.awardId
        && award.recipients.some((kid) => kid.id === entry.kidId))) continue;
      const choices = featured.get(entry.kidId) ?? new Set<string>();
      choices.add(entry.awardId);
      featured.set(entry.kidId, choices);
    }
    group.featuredAwardIds = Object.fromEntries([...featured]
      .filter(([, choices]) => choices.size === 1).map(([id, choices]) => [id, [...choices][0]!]));
  }
  return [...groups.values()];
}
