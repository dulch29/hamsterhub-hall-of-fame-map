import type { Kid, ProvinceCode } from "../types.js";

export type DemoAward = {
  id: string;
  title: string;
  style: "trophy" | "gold" | "silver" | "bronze";
  logoUrl?: string;
};
export type PresentationSlide = { url: string; alt: string; type?: "image" | "video"; poster?: string };
export type AwardAssociation = {
  kidId: string; awardId: string; featured?: boolean; priority?: number;
  projectId?: string | null; slides?: PresentationSlide[]; presentationUrl?: string;
};
export type RecipientAward = DemoAward & { recipients: Kid[] };
export type AwardGroup = {
  id: ProvinceCode;
  province: ProvinceCode;
  leadKidId: string;
  awards: RecipientAward[];
  featuredAwardIds?: Record<string, string>;
  competitionEntries?: AwardAssociation[];
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
    group.competitionEntries = associations.filter((entry) => group.awards.some((award) => award.id === entry.awardId
      && award.recipients.some((kid) => kid.id === entry.kidId))).map((entry) => ({
        kidId: entry.kidId, awardId: entry.awardId, featured: entry.featured, priority: entry.priority,
        projectId: entry.projectId, slides: entry.slides?.map((slide) => ({
          url: slide.url,
          alt: slide.alt,
          ...(slide.type ? { type: slide.type } : {}),
          ...(slide.poster ? { poster: slide.poster } : {}),
        })),
        presentationUrl: entry.presentationUrl,
      }));
  }
  return [...groups.values()];
}
