import { useEffect, useRef, useState } from "react";

/** Split text into user-perceived characters so Thai vowels and tone marks never appear detached from their consonant. */
export function graphemes(text: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    return [...new Intl.Segmenter("th", { granularity: "grapheme" }).segment(text)].map((part) => part.segment);
  }
  return [...text];
}

/** The first `count` user-perceived characters of `text`. */
export function typedPrefix(text: string, count: number): string {
  return graphemes(text).slice(0, Math.max(0, count)).join("");
}

/**
 * Types `text` one grapheme at a time. Returns the visible text and whether typing has finished.
 * Reduced motion, a hidden tab or `instant` show the whole line immediately. `onTick` fires once per typed character
 * (used for a quiet tick sound) and never after the line completes or changes.
 */
export function useTypewriter(text: string, { instant = false, charsPerSecond = 38, onTick }: {
  instant?: boolean; charsPerSecond?: number; onTick?: () => void;
} = {}) {
  const parts = useRef<string[]>([]);
  parts.current = graphemes(text);
  const [count, setCount] = useState(0);
  const tick = useRef(onTick);
  tick.current = onTick;
  useEffect(() => {
    const total = parts.current.length;
    if (instant || document.hidden || matchMedia("(prefers-reduced-motion: reduce)").matches) { setCount(total); return; }
    setCount(0);
    let shown = 0;
    const timer = window.setInterval(() => {
      shown += 1;
      setCount(shown);
      tick.current?.();
      if (shown >= total) window.clearInterval(timer);
    }, Math.max(8, Math.round(1000 / charsPerSecond)));
    return () => window.clearInterval(timer);
  }, [text, instant, charsPerSecond]);
  const shown = Math.min(count, parts.current.length);
  return { text: parts.current.slice(0, shown).join(""), done: shown >= parts.current.length };
}
