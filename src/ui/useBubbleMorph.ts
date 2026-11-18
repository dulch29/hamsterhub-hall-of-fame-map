import { useLayoutEffect, type RefObject } from "react";

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
    const face = card.querySelector<HTMLElement>(".preview-morph-face")!;
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
    const transform = from
      ? `translate(${from.x - to.x}px, ${from.y - to.y}px) scale(${from.width / to.width}, ${from.height / to.height})`
      : "translate(0, 0) scale(0.97)";
    const motion = getComputedStyle(card);
    const easing = motion.getPropertyValue("--ease-out").trim() || "cubic-bezier(0.23, 1, 0.32, 1)";
    const duration = closing ? 240 : 360;
    card.dataset.morph = closing ? "closing" : "opening";
    if (!animate || preference.matches || document.hidden) {
      surface.style.transform = "";
      surface.style.borderRadius = "";
      content.style.opacity = "";
      finish();
      return;
    }
    // Only this finite shell morph paints rounded corners; no width/height animation.
    const shell = surface.animate(closing ? [
      { transform: getComputedStyle(surface).transform, borderRadius: getComputedStyle(surface).borderRadius },
      { transform, borderRadius: "50%" },
    ] : [
      { transform, borderRadius: "50%" },
      { transform: "translate(0, 0) scale(1, 1)", borderRadius: "22px" },
    ], { duration, easing, fill: "both" });
    const copy = content.animate(closing
      ? [{ opacity: getComputedStyle(content).opacity }, { opacity: 0, offset: .35 }, { opacity: 0 }]
      : [{ opacity: 0 }, { opacity: 0, offset: .35 }, { opacity: 1 }],
    { duration, easing, fill: "both" });
    animations.push(shell, copy);
    const identity = content.querySelector<HTMLElement>(".recipient-portrait")!.getBoundingClientRect();
    const bubbleFace = from
      ? `translate(${from.x - to.x}px, ${from.y - to.y}px) scale(${from.width / 62})`
      : `translate(${identity.x - to.x}px, ${identity.y - to.y}px) scale(1)`;
    const cardFace = `translate(${identity.x - to.x}px, ${identity.y - to.y}px) scale(1)`;
    animations.push(face.animate(closing
      ? [{ transform: face.style.transform || cardFace, opacity: getComputedStyle(face).opacity }, { transform: bubbleFace, opacity: 1 }]
      : [{ transform: bubbleFace, opacity: 1 }, { transform: cardFace, opacity: 0 }],
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
        content.style.opacity = getComputedStyle(content).opacity;
        face.style.transform = getComputedStyle(face).transform;
        face.style.opacity = getComputedStyle(face).opacity;
      }
      animations.forEach((animation) => animation.cancel());
      preference.removeEventListener("change", onPreference);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [root, source, closing, animate, onClosed]);
}
