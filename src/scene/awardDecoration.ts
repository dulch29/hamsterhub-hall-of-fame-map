import { AWARD_NAMES, type AwardStyle, type AwardSummary } from "./awards";

const svgNS = "http://www.w3.org/2000/svg";

export function decorateAward(button: HTMLButtonElement, summary: AwardSummary, sprites: Partial<Record<AwardStyle, string>>) {
  const signature = JSON.stringify(summary);
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
  const count = Math.min(30, 10 + summary.awardCount * 3);
  const points = Array.from({ length: count }, (_, i) => {
    const angle = i * 2.39996;
    const radius = 34 + (i * 17 % 43);
    return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius * 0.78 };
  });
  points.forEach((point, i) => {
    if (i > 0 && i % 3 !== 0) {
      const previous = points[i - 1]!;
      const line = document.createElementNS(svgNS, "line");
      line.setAttribute("x1", String(previous.x));
      line.setAttribute("y1", String(previous.y));
      line.setAttribute("x2", String(point.x));
      line.setAttribute("y2", String(point.y));
      svg.append(line);
    }
    const star = document.createElementNS(svgNS, i % 4 === 0 ? "path" : "circle");
    if (i % 4 === 0) {
      star.setAttribute("d", "M0 -5 1.2 -1.2 5 0 1.2 1.2 0 5 -1.2 1.2 -5 0 -1.2 -1.2Z");
      star.setAttribute("transform", `translate(${point.x} ${point.y})`);
    } else {
      star.setAttribute("cx", String(point.x));
      star.setAttribute("cy", String(point.y));
      star.setAttribute("r", i % 3 === 0 ? "1.9" : "1.2");
    }
    star.style.animationDelay = `${-(i * 0.37)}s`;
    svg.append(star);
  });
  constellation.append(svg);
  decoration.append(constellation);
  summary.companions.forEach(({ style, count }, index) => {
    const satellite = document.createElement("span");
    satellite.className = "award-satellite";
    satellite.dataset.award = style;
    const countOfStyles = summary.companions.length;
    const x = countOfStyles === 1 ? 47 : index === 0 ? -47 : index === countOfStyles - 1 ? 47 : 0;
    const y = countOfStyles === 1 ? 14 : index === 0 ? 15 : index === countOfStyles - 1 ? -13 : -46;
    satellite.style.left = `calc(50% + ${x}px)`;
    satellite.style.top = `calc(50% + ${y}px)`;
    const image = document.createElement("img");
    image.src = sprites[style] ?? "";
    image.alt = "";
    image.width = 34;
    image.height = 37;
    image.style.animationDelay = `${-index * 1.3}s`;
    satellite.append(image);
    if (count > 1) {
      const quantity = document.createElement("span");
      quantity.className = "award-quantity";
      quantity.textContent = String(count);
      satellite.append(quantity);
    }
    decoration.append(satellite);
  });
  button.prepend(decoration);
  button.dataset.awardCount = String(summary.awardCount);
  button.dataset.makerCount = String(summary.makerCount);
  const others = summary.companions.map(({ style, count }) => `${count > 1 ? `${count} ` : ""}${AWARD_NAMES[style].toLowerCase()}`);
  button.setAttribute("aria-description", `${AWARD_NAMES[summary.primary]}${others.length ? ` with ${others.join(", ")}` : ""} sample artwork`);
}
