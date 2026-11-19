export const BUBBLE_FORM_DURATION = 620;

export function burstBubble(rect: DOMRect, forming = false) {
  if (document.hidden || matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  const burst = document.createElement("span");
  burst.className = "bubble-burst";
  burst.dataset.kind = forming ? "form" : "pop";
  burst.setAttribute("aria-hidden", "true");
  Object.assign(burst.style, { left: `${rect.x + rect.width / 2}px`, top: `${rect.y + rect.height / 2}px`, width: `${rect.width}px`, height: `${rect.height}px` });
  const animations: Animation[] = [];
  const membrane = document.createElement("span");
  membrane.className = "bubble-burst__ring bubble-film";
  burst.append(membrane);
  animations.push(membrane.animate(forming ? [
    { transform: "scale(.12)", opacity: 0 },
    { transform: "scale(.38)", opacity: .35, offset: .28 },
    { transform: "scale(.92)", opacity: .9, offset: .56, easing: "ease-out" },
    { transform: "scale(1.025, .985)", opacity: 0, offset: .86 },
    { transform: "scale(1)", opacity: 0 },
  ] : [
    { transform: "scale(1)", opacity: .85 },
    { transform: "scale(1.09, 1.04)", opacity: .55, offset: .28 },
    { transform: "scale(1.16)", opacity: 0 },
  ], { duration: forming ? BUBBLE_FORM_DURATION : 190, easing: forming ? "linear" : "cubic-bezier(.22, .65, .3, 1)", fill: "both" }));
  for (let index = 0; index < (forming ? 8 : 12); index++) {
    const particle = document.createElement("span");
    particle.className = "bubble-burst__drop bubble-film";
    const angle = index * Math.PI * 2 / (forming ? 8 : 12) + .18;
    const size = rect.width * (forming ? .17 + index % 3 * .055 : .035 + index % 3 * .025);
    Object.assign(particle.style, { width: `${size}px`, height: `${size}px`, margin: `${-size / 2}px` });
    burst.append(particle);
    const radius = rect.width * (forming ? .95 + index % 3 * .17 : .42);
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    const bend = index % 2 ? 1 : -1;
    const frames: Keyframe[] = forming ? [
      { transform: `translate(${x}px, ${y}px) scale(.65)`, opacity: 0 },
      { transform: `translate(${x * .94}px, ${y * .94}px) scale(1)`, opacity: .95, offset: .12 },
      { transform: `translate(${x * .45 - y * .12 * bend}px, ${y * .45 + x * .12 * bend}px) scale(.86, 1.08)`, opacity: .9, offset: .5 },
      { transform: `translate(${x * .14}px, ${y * .14}px) scale(.4)`, opacity: .65, offset: .76 },
      { transform: "translate(0, 0) scale(.02)", opacity: 0 },
    ] : [
      { transform: `translate(${x}px, ${y}px) scale(.25)`, opacity: 0 },
      { transform: `translate(${x * 1.3}px, ${y * 1.3}px) scale(1.1, .85)`, opacity: .95, offset: .15 },
      { transform: `translate(${x * 2.5 - y * .15}px, ${y * 2.5 + 10}px) scale(.25)`, opacity: 0 },
    ];
    const delay = index * (forming ? 12 : 4);
    animations.push(particle.animate(frames, {
      duration: forming ? BUBBLE_FORM_DURATION - delay : 350,
      delay, easing: forming ? "cubic-bezier(.45, 0, .55, 1)" : "cubic-bezier(.16, .8, .3, 1)", fill: "both",
    }));
  }
  if (!forming) for (let index = 0; index < 4; index++) {
    const arc = document.createElement("span");
    arc.className = "bubble-burst__arc";
    const angle = index * Math.PI / 2 + .35;
    const rotation = index * 90 + 20;
    burst.append(arc);
    animations.push(arc.animate([
      { transform: `rotate(${rotation}deg) scale(1)`, opacity: .85 },
      { transform: `translate(${Math.cos(angle) * rect.width * .24}px, ${Math.sin(angle) * rect.height * .24}px) rotate(${rotation + 12}deg) scale(1.12)`, opacity: 0 },
    ], { duration: 230, easing: "ease-out", fill: "both" }));
  }
  document.body.append(burst);
  const remove = () => {
    animations.forEach((animation) => animation.cancel());
    burst.remove();
    document.removeEventListener("visibilitychange", onVisibility);
    preference.removeEventListener("change", onPreference);
  };
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  const onPreference = () => { if (preference.matches) remove(); };
  const onVisibility = () => { if (document.hidden) remove(); };
  preference.addEventListener("change", onPreference);
  document.addEventListener("visibilitychange", onVisibility);
  void Promise.all(animations.map((animation) => animation.finished)).then(remove, remove);
  return remove;
}
