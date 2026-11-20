import { prepareKids } from "../data/prepareKids.js";
import { DEMO_AWARDS, resolveAwardGroups, type AwardAssociation } from "../data/demoAwards.js";
import { generateMockKids } from "./generate.js";

export function createDiscoveryDemo(groupFixture = false) {
  const raw = generateMockKids({ count: groupFixture ? 8 : 3 });
  raw.forEach((kid, index) => {
    if (groupFixture) kid.province = "TH-10";
    kid.avatarUrl = index < 2 ? `/demo/portrait-${index + 1}.svg` : null;
    kid.projects.forEach((project) => {
      project.title = index === 0 ? "Hamster Maze" : "Space Garden";
      project.shortDescription = index === 0
        ? "ลองออกแบบเขาวงกตให้แฮมสเตอร์ แล้วใช้โค้ดช่วยหาเส้นทางกลับบ้าน"
        : "สวนเล็ก ๆ ในอวกาศที่เติบโตจากจินตนาการและการทดลองเขียนโค้ด";
      project.thumbnailUrl = index < 2 ? `/demo/project-${index + 1}.svg` : null;
    });
  });
  raw[0]!.projects.push({ ...raw[0]!.projects[0]!, id: `${raw[0]!.id}-journal`,
    title: "Maze Builder Journal", shortDescription: "เบื้องหลังการออกแบบเขาวงกต ทดลองเส้นทาง และปรับปรุงกติกาทีละขั้น" });
  if (groupFixture) {
    raw[6]!.profileUrl = "javascript:void(0)";
    raw[6]!.projects[0]!.url = "javascript:void(0)";
    raw[7]!.displayName = "Mock Student With A Very Long Display Name";
    raw[7]!.avatarUrl = "/demo/missing-portrait.svg";
    raw[7]!.projects[0]!.title = "An Imaginative Interactive World Built With Creative Coding And Curious Experiments";
    raw[7]!.projects[0]!.thumbnailUrl = "/demo/missing-project.svg";
    raw.push({ ...raw[0]!, id: "hidden-recipient", displayName: "Hidden Student", showOnMap: false });
  }
  const associations: AwardAssociation[] = groupFixture
    ? raw.map((kid) => ({ kidId: kid.id, awardId: "creative", featured: true }))
    : [
        { kidId: raw[0]!.id, awardId: "creative", featured: true },
        { kidId: raw[0]!.id, awardId: "maker" },
        { kidId: raw[0]!.id, awardId: "explorer" },
        { kidId: raw[1]!.id, awardId: "explorer", featured: true },
        { kidId: raw[1]!.id, awardId: "ocean" },
        { kidId: raw[2]!.id, awardId: "ocean", featured: true },
      ];
  if (groupFixture) {
    associations.push(...raw.slice(0, 3).map((kid) => ({ kidId: kid.id, awardId: "maker" })));
    associations.push({ kidId: raw[0]!.id, awardId: "explorer" });
  }
  for (const entry of associations) {
    const person = raw.find((kid) => kid.id === entry.kidId)!;
    entry.priority = ({ creative: 0, maker: 1, explorer: 2, ocean: 3 } as Record<string, number>)[entry.awardId];
    if (entry.awardId === "creative") {
      entry.projectId = person.projects[0]?.id ?? null;
      if (person.id === raw[0]!.id) {
        entry.slides = [{ url: "/demo/project-1.svg", alt: "Hamster Maze: ภาพรวมเขาวงกต" },
          { url: "/demo/maze-route.svg", alt: "Hamster Maze: แผนเส้นทางและขั้นตอนการทดลอง" }];
        entry.presentationUrl = "/demo/maze-notes.pdf";
      }
      if (groupFixture && person.id === raw[7]!.id) entry.slides = [
        { url: "javascript:void(0)", alt: "Unsafe test image" },
        { url: "/demo/missing-slide.svg", alt: "Missing test image" },
        { url: "/demo/project-2.svg", alt: "Available test image" },
      ];
    } else if (entry.awardId === "maker" && person.id === raw[0]!.id) {
      entry.projectId = `${person.id}-journal`;
    } else if (entry.awardId === "explorer" && person.id === raw[1]!.id) {
      entry.projectId = person.projects[0]?.id ?? null;
      entry.slides = [{ url: "/demo/project-2.svg", alt: "Space Garden: สวนอวกาศที่ออกแบบด้วยโค้ด" }];
    } else if (entry.awardId === "ocean" && person.id === raw[1]!.id) {
      entry.projectId = null;
      entry.presentationUrl = "/demo/maze-notes.pdf";
    }
  }
  const kids = prepareKids(raw);
  return { kids, groups: resolveAwardGroups(kids, DEMO_AWARDS, associations) };
}
