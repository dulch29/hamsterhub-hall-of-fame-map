export function burstBubble(rect: DOMRect, forming = false) {
  if (document.hidden || matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  const burst = document.createElement("span");
  burst.className = "bubble-burst";
  burst.dataset.kind = forming ? "form" : "pop";
  burst.setAttribute("aria-hidden", "true");
  Object.assign(burst.style, { left: `${rect.x + rect.width / 2}px`, top: `${rect.y + rect.height / 2}px`, width: `${rect.width}px`, height: `${rect.height}px` });
  const animations: Animation[] = [];
  for (let index = 0; index < 9; index++) {
    const particle = document.createElement("span");
    particle.className = index ? "bubble-burst__drop" : "bubble-burst__ring";
    burst.append(particle);
  }
  document.body.append(burst);
  Array.from(burst.children).forEach((particle, index) => {
    const angle = index * Math.PI / 4;
    const radius = rect.width * .65;
    const spread = index ? `translate(${Math.cos(angle) * radius}px, ${Math.sin(angle) * radius}px) scale(.4)` : "scale(1.35)";
    const frames = [{ transform: index ? "translate(0, 0) scale(1)" : "scale(.85)", opacity: 1 }, { transform: spread, opacity: 0 }];
    animations.push(particle.animate(forming ? [...frames].reverse() : frames, { duration: 280, easing: "cubic-bezier(0.23, 1, 0.32, 1)", fill: "both" }));
  });
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
