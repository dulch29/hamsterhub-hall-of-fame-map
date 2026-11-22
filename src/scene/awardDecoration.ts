import { buildingLevelForCount, type AwardSummary } from "./awards";

const svgNS = "http://www.w3.org/2000/svg";

export function decorateAward(button: HTMLButtonElement, summary: AwardSummary, recipientCount?: number) {
  const count = recipientCount ?? summary.makerCount;
  const level = buildingLevelForCount(count);
  const signature = `${JSON.stringify(summary)}:${count}`;
  if (button.dataset.decoration === signature) return;
  button.dataset.decoration = signature;
  button.querySelector(".award-decoration")?.remove();
  const decoration = document.createElement("span");
  decoration.className = "award-decoration";
  decoration.setAttribute("aria-hidden", "true");
  const constellation = document.createElement("span");
  constellation.className = "award-constellation";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", "-90 -90 180 180");
  const starCount = Math.min(12, 3 + level * 2);
  for (let i = 0; i < starCount; i++) {
    const angle = i * 2.39996;
    const radius = 36 + (i * 19 % 34);
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius * 0.72;
    const dot = document.createElementNS(svgNS, "circle");
    dot.setAttribute("cx", String(x));
    dot.setAttribute("cy", String(y));
    dot.setAttribute("r", i % 3 === 0 ? "1.6" : "1.1");
    dot.style.animationDelay = `${-(i * 0.4)}s`;
    svg.append(dot);
  }
  constellation.append(svg);
  decoration.append(constellation);
  button.prepend(decoration);
  button.dataset.buildingLevel = String(level);
  button.dataset.awardCount = String(summary.awardCount);
  button.dataset.makerCount = String(count);
  button.setAttribute("aria-description", `Building level ${level} · ${count} recipients`);
}
