import type { Kid, ProvinceCode } from '../types.js';
import type { AwardAssociation, DemoAward } from '../data/demoAwards.js';
import type { PreviewMedia } from '../data/localPreview.js';

const profiles: { nickname: string; fullName: string; province: ProvinceCode; title: string; description: string }[] = [
  {
    nickname: 'Arun', fullName: 'Mock Arun Chaiwat', province: 'TH-10', title: 'LeafLoop',
    description: 'ริเริ่มและพัฒนา LeafLoop แอปพลิเคชันช่วยลดขยะอาหารในโรงเรียน โดยให้ผู้ใช้งานบันทึกอาหารที่เหลือ วางแผนมื้อถัดไป และแลกเปลี่ยนวัตถุดิบที่ยังใช้ได้ ผ่านระบบแจ้งเตือน ปฏิทิน และภารกิจสะสมคะแนนร่วมกับเพื่อน โดยออกแบบหน้าจอให้ใช้งานง่าย สร้างต้นแบบและทดลองกับกลุ่มผู้ใช้งานสมมติ ก่อนนำผลตอบรับมาปรับปรุงระบบสรุปข้อมูลให้เข้าใจได้ชัดเจนยิ่งขึ้น',
  },
  {
    nickname: 'Mook', fullName: 'Mock Mook Narin', province: 'TH-10', title: 'Quiet Space',
    description: 'ออกแบบและพัฒนา Quiet Space แอปพลิเคชันช่วยสร้างสมาธิระหว่างการเรียนและทำงาน โดยให้ผู้ใช้งานเลือกช่วงเวลาที่เหมาะสม บันทึกเป้าหมาย และติดตามความรู้สึกหลังจบกิจกรรม ผ่านตัวจับเวลา เสียงธรรมชาติ และสวนเสมือนที่เติบโตตามความสม่ำเสมอ โดยสร้างต้นแบบสำหรับสถานการณ์ทดสอบ ทดลองเส้นทางการใช้งาน และปรับปรุงข้อความแจ้งเตือนให้เป็นมิตรโดยไม่รบกวนผู้ใช้',
  },
  {
    nickname: 'Beam', fullName: 'Mock Beam Suriya', province: 'TH-10', title: 'Route Buddy',
    description: 'ริเริ่มและพัฒนา Route Buddy เครื่องมือวางแผนการเดินทางที่ช่วยให้ผู้ใช้งานเปรียบเทียบเส้นทาง เวลา และจุดเปลี่ยนการเดินทางได้ในหน้าจอเดียว พร้อมรายการสิ่งที่ต้องเตรียมและระบบบันทึกเส้นทางโปรด โดยใช้ข้อมูลสถานที่สมมติสำหรับสร้างต้นแบบ ออกแบบแผนที่ที่อ่านง่าย และทดสอบขั้นตอนการค้นหากับหลายสถานการณ์ ก่อนปรับปรุงการแสดงผลให้เหมาะกับหน้าจอโทรศัพท์',
  },
  {
    nickname: 'Fah', fullName: 'Mock Fah Wiriya', province: 'TH-50', title: 'Forest Notes',
    description: 'ออกแบบและพัฒนา Forest Notes สมุดบันทึกธรรมชาติดิจิทัลที่ชวนผู้ใช้งานสังเกตต้นไม้และสิ่งแวดล้อมรอบตัว ผ่านภาพประกอบ บันทึกประจำวัน และภารกิจสำรวจตามฤดูกาล พร้อมแสดงความเปลี่ยนแปลงเป็นเส้นเวลาที่เข้าใจง่าย โดยจัดทำเนื้อหาและสถานที่สมมติ สร้างต้นแบบการบันทึกภาพและข้อความ แล้วทดลองการใช้งานบนโทรศัพท์เพื่อปรับปรุงขั้นตอนให้กระชับและสนุกมากขึ้น',
  },
  {
    nickname: 'Phu', fullName: 'Mock Phu Kittisak', province: 'TH-40', title: 'Water Wise',
    description: 'ริเริ่มและพัฒนา Water Wise แอปพลิเคชันเรียนรู้การใช้น้ำอย่างประหยัด โดยให้ผู้ใช้งานบันทึกกิจกรรมในแต่ละวัน ตั้งเป้าหมาย และเปรียบเทียบแนวโน้มการใช้น้ำผ่านกราฟที่อ่านง่าย พร้อมภารกิจดูแลสวนเสมือนและคำแนะนำที่เหมาะกับกิจวัตร โดยสร้างข้อมูลจำลองและต้นแบบหน้าจอ ทดสอบสถานการณ์ที่มีข้อมูลหลายช่วงเวลา ก่อนปรับปรุงระบบให้ติดตามผลได้ต่อเนื่องบนโทรศัพท์',
  },
  {
    nickname: 'Pim', fullName: 'Mock Pim Tharika', province: 'TH-83', title: 'Coral Classroom',
    description: 'ออกแบบและพัฒนา Coral Classroom ห้องเรียนทะเลแบบโต้ตอบที่ช่วยให้ผู้ใช้งานรู้จักปะการังและสิ่งมีชีวิตชายฝั่ง ผ่านเรื่องเล่า เกมจับคู่ และกิจกรรมสร้างแนวปะการังเสมือน พร้อมสมุดสะสมความรู้ที่กลับมาทบทวนได้ โดยจัดทำภาพประกอบและบทเรียนสมมติสำหรับต้นแบบ ทดลองลำดับกิจกรรมและการอ่านบนหน้าจอเล็ก แล้วนำผลการทดสอบมาปรับปรุงคำอธิบายให้ชัดเจนและเข้าถึงง่าย',
  },
];

export function fictionalReviewKids(): Kid[] {
  return profiles.map((profile, index): Kid => {
    const id = `review-fictional-${index + 1}`;
    const projectId = `${id}-project`;
    return {
      id, displayName: profile.fullName, fullName: profile.fullName, nickname: profile.nickname,
      avatarUrl: `/review/face-${index + 1}.png`, province: profile.province,
      showOnMap: true, profileUrl: '', featuredProjectId: projectId, featuredProject: null,
      projects: [{ id: projectId, title: profile.title, shortDescription: profile.description,
        thumbnailUrl: `/review/project-${index + 1}.png`, url: '', createdAt: '2026-11-19T00:00:00.000Z' }],
    };
  });
}

export const DEFAULT_REVIEW_AWARDS: readonly DemoAward[] = [
  { id: 'review-competition-2', title: 'Young Makers Challenge 2026', style: 'gold', logoUrl: '/demo/project-1.svg' },
  { id: 'review-competition-3', title: 'Digital Wellbeing Challenge 2026', style: 'silver', logoUrl: '/demo/project-2.svg' },
  { id: 'review-competition-4', title: 'Smart City Youth Contest 2026', style: 'bronze', logoUrl: '/demo/maze-route.svg' },
  { id: 'review-competition-5', title: 'Young Eco-Tech Challenge 2026', style: 'gold', logoUrl: '/demo/project-1.svg' },
  { id: 'review-competition-6', title: 'Water Innovation Youth Cup 2026', style: 'bronze', logoUrl: '/demo/maze-route.svg' },
  { id: 'review-competition-7', title: 'Ocean Conservation Challenge 2026', style: 'trophy', logoUrl: '/demo/project-2.svg' },
  { id: 'review-competition-8', title: 'Marine Biodiversity Youth Award 2026', style: 'bronze', logoUrl: '/demo/project-1.svg' },
];

export function defaultReviewAssociations(): AwardAssociation[] {
  const fictional = fictionalReviewKids();
  return [
    { kidId: fictional[0]!.id, awardId: 'review-competition-2', featured: true, priority: 0, projectId: fictional[0]!.projects[0]!.id, slides: [{ url: '/review/project-1.png', alt: `${fictional[0]!.projects[0]!.title}: ภาพผลงานตัวอย่างสมมติ` }] },
    { kidId: fictional[1]!.id, awardId: 'review-competition-3', featured: true, priority: 0, projectId: fictional[1]!.projects[0]!.id, slides: [{ url: '/review/project-2.png', alt: `${fictional[1]!.projects[0]!.title}: ภาพผลงานตัวอย่างสมมติ` }] },
    { kidId: fictional[2]!.id, awardId: 'review-competition-4', featured: true, priority: 0, projectId: fictional[2]!.projects[0]!.id, slides: [{ url: '/review/project-3.png', alt: `${fictional[2]!.projects[0]!.title}: ภาพผลงานตัวอย่างสมมติ` }] },
    { kidId: fictional[3]!.id, awardId: 'review-competition-5', featured: true, priority: 0, projectId: fictional[3]!.projects[0]!.id, slides: [{ url: '/review/project-4.png', alt: `${fictional[3]!.projects[0]!.title}: ภาพผลงานตัวอย่างสมมติ` }] },
    { kidId: fictional[4]!.id, awardId: 'review-competition-6', featured: true, priority: 0, projectId: fictional[4]!.projects[0]!.id, slides: [{ url: '/review/project-5.png', alt: `${fictional[4]!.projects[0]!.title}: ภาพผลงานตัวอย่างสมมติ` }] },
    { kidId: fictional[5]!.id, awardId: 'review-competition-7', featured: true, priority: 0, projectId: fictional[5]!.projects[0]!.id, slides: [{ url: '/review/project-6.png', alt: `${fictional[5]!.projects[0]!.title}: ภาพผลงานตัวอย่างสมมติ` }] },
    { kidId: fictional[5]!.id, awardId: 'review-competition-8', featured: false, priority: 1, projectId: fictional[5]!.projects[0]!.id },
  ];
}

/** Explicit review fixture; never imported by the default three-student demo. */
export function createReviewScaleFixture(
  owner: Kid,
  competition: DemoAward,
  ownerAssociations: readonly AwardAssociation[] = [],
  ownerAwards: readonly DemoAward[] = [competition],
  fictionalAwards?: readonly DemoAward[],
  fictionalAssociations?: readonly AwardAssociation[],
) {
  const kids = [owner, ...fictionalReviewKids()];
  const previews: Record<string, PreviewMedia> = {
    [owner.id]: { portraitUrl: '/__local-preview/portrait.png', presentationUrl: '/__local-preview/presentation.pdf' },
    ...Object.fromEntries(kids.slice(1).map((kid, index) => [kid.id, {
      portraitUrl: `/review/portrait-${index + 1}.png`, fictional: true,
    }])),
  };
  const extraAwards = fictionalAwards ?? [];
  const awards = [
    competition,
    ...ownerAwards.filter((award) => award.id !== competition.id),
    ...extraAwards.filter((award) => award.id !== competition.id && !ownerAwards.some((a) => a.id === award.id)),
  ];
  const curatedOwner = ownerAssociations.filter((entry) => entry.kidId === owner.id && awards.some((award) => award.id === entry.awardId));
  const associations: AwardAssociation[] = [
    ...(curatedOwner.length ? curatedOwner : [{ kidId: owner.id, awardId: competition.id }]),
    ...(fictionalAssociations ?? kids.slice(1).map((kid, index) => ({
      kidId: kid.id, awardId: competition.id, featured: true, priority: 0,
      projectId: kid.projects[0]!.id,
      slides: [{ url: `/review/project-${index + 1}.png`, alt: `${kid.projects[0]!.title}: ภาพผลงานตัวอย่างสมมติ` }],
    }))),
  ];
  return { kids, awards, associations, previews };
}
