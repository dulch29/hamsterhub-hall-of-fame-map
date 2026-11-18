import { useLayoutEffect, useRef, type RefObject } from "react";
import { burstBubble } from "./bubbleFeedback";

export function useDiscoveryMotion(root: RefObject<HTMLDivElement | null>, closing: boolean, onClosed: () => void,
  studentId: string | null, source: HTMLElement | null, animate: boolean) {
  const previousStudent = useRef(studentId);
  useLayoutEffect(() => {
    const wasOpen = previousStudent.current;
    previousStudent.current = studentId;
    if (!wasOpen || studentId || closing || !animate || !source || document.hidden || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const face = source.querySelector<HTMLElement>(".recipient-orb, .recipient-portrait") ?? source;
    const clearBurst = burstBubble(face.getBoundingClientRect(), true);
    const arrival = source.querySelector<HTMLElement>(".bubble-arrival") ?? source;
    const animation = arrival.animate([{ transform: "scale(.82)", opacity: .3 }, { transform: "scale(1)", opacity: 1 }],
      { duration: 240, easing: "cubic-bezier(0.23, 1, 0.32, 1)" });
    return () => { animation.cancel(); clearBurst(); };
  }, [root, studentId, source, closing, animate]);
  useLayoutEffect(() => {
    if (!closing || !root.current) return;
    const element = root.current;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches || document.hidden) { onClosed(); return; }
    let disposed = false;
    const target = { x: Number(element.dataset.anchorX), y: Number(element.dataset.anchorY) };
    const animations: Animation[] = [];
    element.querySelectorAll<HTMLElement>(".recipient-bubble").forEach((bubble, index) => {
      const arrival = bubble.querySelector<HTMLElement>(".bubble-arrival")!;
      const rect = bubble.getBoundingClientRect();
      animations.push(arrival.animate([
        { transform: getComputedStyle(arrival).transform, opacity: 1 },
        { transform: `translate(${target.x - rect.x - rect.width / 2}px, ${target.y - rect.y - rect.height / 2}px) scale(.08)`, opacity: 0 },
      ], { duration: 280, delay: index * 20, easing: "cubic-bezier(0.77, 0, 0.175, 1)", fill: "both" }));
    });
    const finish = () => { if (!disposed) onClosed(); };
    const settle = () => animations.forEach((animation) => animation.finish());
    const onPreference = () => { if (preference.matches) settle(); };
    const onVisibility = () => { if (document.hidden) settle(); };
    preference.addEventListener("change", onPreference);
    document.addEventListener("visibilitychange", onVisibility);
    void Promise.all(animations.map((animation) => animation.finished)).then(finish, () => {});
    return () => {
      disposed = true;
      animations.forEach((animation) => animation.cancel());
      preference.removeEventListener("change", onPreference);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [root, closing, onClosed]);
}
