import type { Project } from "../types";
import type { AwardGroup, PresentationSlide, RecipientAward } from "./demoAwards";

export type StudentCompetition = {
  award: RecipientAward;
  featured: boolean;
  priority: number | null;
  project: Project | null;
  slides: PresentationSlide[];
  presentationUrl: string | null;
};

export function studentCompetitions(group: AwardGroup, kidId: string): StudentCompetition[] {
  const entries: StudentCompetition[] = [];
  for (const award of group.awards) {
    const kid = award.recipients.find((person) => person.id === kidId && person.showOnMap === true && person.province === group.province);
    if (!kid) continue;
    const matches = group.competitionEntries?.filter((entry) => entry.kidId === kidId && entry.awardId === award.id) ?? [];
    const curation = (entry: (typeof matches)[number]) => JSON.stringify({
      priority: entry.priority ?? null, projectId: entry.projectId ?? null,
      slides: entry.slides ?? [], presentationUrl: entry.presentationUrl ?? null,
    });
    // Repeated memberships may agree, but conflicting media must stay unset.
    const metadata = matches[0] && matches.every((entry) => curation(entry) === curation(matches[0]!)) ? matches[0] : undefined;
    const priority = metadata?.priority;
    entries.push({
      award, featured: group.featuredAwardIds?.[kidId] === award.id,
      priority: typeof priority === "number" && Number.isSafeInteger(priority) && priority >= 0 ? priority : null,
      project: kid.projects.find((project) => project.id === metadata?.projectId) ?? null,
      slides: metadata?.slides?.map((slide) => ({ ...slide })) ?? [],
      presentationUrl: metadata?.presentationUrl ?? null,
    });
  }
  return entries.sort((a, b) => Number(b.featured) - Number(a.featured)
    || (a.priority ?? Infinity) - (b.priority ?? Infinity) || a.award.id.localeCompare(b.award.id, "en"));
}
