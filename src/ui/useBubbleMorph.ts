import { useLayoutEffect, type RefObject } from "react";
import { burstBubble } from "./bubbleFeedback";

type Options = {
  root: RefObject<HTMLElement | null>;
  source: HTMLElement | null;
  closing: boolean;
  animate: boolean;
  onClosed: () => void;
};

export function useBubbleMorph({ root, source, closing, animate, onClosed }: Options) {
  useLayoutEffect(() => {
    const card = root.current;
    if (!card) return;
    const surface = card.querySelector<HTMLElement>(".student-preview__surface")!;
    const content = card.querySelector<HTMLElement>(".student-preview__content")!;
    const name = card.querySelector<HTMLElement>(".student-preview__name")!;
    const portrait = card.querySelector<HTMLElement>(".student-preview__identity")!;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const animations: Animation[] = [];
    let disposed = false;
    const finish = () => {
      if (disposed) return;
      card.dataset.morph = closing ? "closed" : "open";
      if (closing) onClosed();
      else card.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
    };
    const sourceElement = source?.querySelector<HTMLElement>(".recipient-orb, .recipient-portrait") ?? source;
    const from = sourceElement?.getBoundingClientRect();
    const to = card.getBoundingClientRect();
    const hero = { x: to.x + portrait.offsetLeft, y: to.y + portrait.offsetTop, width: portrait.offsetWidth, height: portrait.offsetHeight };
    const portraitTransform = from
      ? `translate(${from.x + from.width / 2 - hero.x - hero.width / 2}px, ${from.y + from.height / 2 - hero.y - hero.height / 2}px) scale(${from.width / hero.width})`
      : "scale(.85)";
    const clearBurst = !closing && animate && from ? burstBubble(from) : () => {};
    const x = from ? from.x + from.width / 2 - to.x : to.width / 2;
    const y = from ? from.y + from.height / 2 - to.y : 0;
    const diameter = from?.width ?? 84;
    const scaleX = diameter / to.width;
    const scaleY = diameter / to.height;
    surface.style.transformOrigin = `${x}px ${y}px`;
    const transform = `translate(${x * scaleX - diameter / 2}px, ${y * scaleY - diameter / 2}px) scale(${scaleX}, ${scaleY})`;
    const motion = getComputedStyle(card);
    const easing = motion.getPropertyValue("--ease-out").trim() || "cubic-bezier(0.23, 1, 0.32, 1)";
    const duration = closing ? 240 : 360;
    card.dataset.morph = closing ? "closing" : "opening";
    if (!animate || preference.matches || document.hidden) {
      surface.style.transform = "";
      surface.style.borderRadius = "";
      surface.style.opacity = "";
      content.style.opacity = "";
      name.style.opacity = "";
      portrait.style.transform = "";
      portrait.style.opacity = "";
      finish();
      return clearBurst;
    }
    // Only this finite shell morph paints rounded corners; no width/height animation.
    const shell = surface.animate(closing ? [
      { transform: getComputedStyle(surface).transform, borderRadius: getComputedStyle(surface).borderRadius, opacity: getComputedStyle(surface).opacity },
      { transform, borderRadius: "50%", opacity: 0 },
    ] : [
      { transform, borderRadius: "50%", opacity: 0 },
      { transform: "translate(0, 0) scale(1, 1)", borderRadius: motion.getPropertyValue("--preview-radius").trim(), opacity: 1 },
    ], { duration, easing, fill: "both" });
    const copy = content.animate(closing
      ? [{ opacity: getComputedStyle(content).opacity }, { opacity: 0, offset: .35 }, { opacity: 0 }]
      : [{ opacity: 0 }, { opacity: 0, offset: .35 }, { opacity: 1 }],
    { duration, easing, fill: "both" });
    animations.push(shell, copy, name.animate(closing
      ? [{ opacity: getComputedStyle(name).opacity }, { opacity: 0 }]
      : [{ opacity: 0 }, { opacity: 1 }], { duration, easing, fill: "both" }));
    animations.push(portrait.animate(closing
      ? [{ transform: getComputedStyle(portrait).transform, opacity: getComputedStyle(portrait).opacity }, { transform: portraitTransform, opacity: 0 }]
      : [{ transform: portraitTransform, opacity: .35 }, { transform: "translate(0, 0) scale(1)", opacity: 1 }],
      { duration, easing, fill: "both" }));
    void shell.finished.then(finish, () => {});
    const settle = () => { animations.forEach((animation) => animation.finish()); };
    const onPreference = () => { if (preference.matches) settle(); };
    const onVisibility = () => { if (document.hidden) settle(); };
    preference.addEventListener("change", onPreference);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      disposed = true;
      // Preserve an interrupted opening so close can retarget from its actual pose.
      if (card.isConnected) {
        surface.style.transform = getComputedStyle(surface).transform;
        surface.style.borderRadius = getComputedStyle(surface).borderRadius;
        surface.style.opacity = getComputedStyle(surface).opacity;
        content.style.opacity = getComputedStyle(content).opacity;
        name.style.opacity = getComputedStyle(name).opacity;
        portrait.style.transform = getComputedStyle(portrait).transform;
        portrait.style.opacity = getComputedStyle(portrait).opacity;
      }
      animations.forEach((animation) => animation.cancel());
      clearBurst();
      preference.removeEventListener("change", onPreference);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [root, source, closing, animate, onClosed]);
}
