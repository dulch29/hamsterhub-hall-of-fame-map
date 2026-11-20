import { useLayoutEffect, useRef, type RefObject } from "react";
import { BUBBLE_FORM_DURATION, burstBubble } from "./bubbleFeedback";

export function useAllBubbleFeedback(button: RefObject<HTMLButtonElement | null>, showAll: boolean,
  closing: boolean, onSound?: (forming: boolean) => void) {
  const previous = useRef(showAll);
  const cleanup = useRef<() => void>(() => {});
  const sound = useRef(onSound);
  sound.current = onSound;
  useLayoutEffect(() => () => cleanup.current(), []);
  useLayoutEffect(() => {
    const returning = previous.current && !showAll;
    previous.current = showAll;
    if (closing) { cleanup.current(); return; }
    if (!returning || closing || !button.current?.checkVisibility()) return;
    cleanup.current();
    sound.current?.(true);
    const bubble = button.current;
    const orb = bubble.querySelector<HTMLElement>(".recipient-orb")!;
    const clear = burstBubble(orb.getBoundingClientRect(), true);
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches || document.hidden) { cleanup.current = clear; return; }
    const arrival = bubble.querySelector<HTMLElement>(".bubble-arrival")!;
    bubble.dataset.reforming = "true";
    const animation = arrival.animate([
      { transform: "scale(.8)", opacity: 0 },
      { transform: "scale(.92)", opacity: 0, offset: .56 },
      { transform: "scale(1.025, .985)", opacity: 1, offset: .86 },
      { transform: "scale(1)", opacity: 1 },
    ], { duration: BUBBLE_FORM_DURATION, easing: "linear", fill: "both" });
    const finish = () => {
      animation.cancel(); clear(); delete bubble.dataset.reforming;
      preference.removeEventListener("change", settle);
      document.removeEventListener("visibilitychange", onVisibility);
    };
    const settle = () => { if (preference.matches) finish(); };
    const onVisibility = () => { if (document.hidden) finish(); };
    preference.addEventListener("change", settle);
    document.addEventListener("visibilitychange", onVisibility);
    void animation.finished.then(finish, () => {});
    cleanup.current = finish;
  }, [button, showAll, closing]);
  return () => {
    cleanup.current();
    sound.current?.(false);
    const orb = button.current?.querySelector<HTMLElement>(".recipient-orb");
    if (orb) cleanup.current = burstBubble(orb.getBoundingClientRect());
  };
}
