import { useCallback, useEffect, useRef, useState } from "react";

export function useBubbleSound() {
  const [muted, setMuted] = useState(false);
  const context = useRef<AudioContext | null>(null);
  const active = useRef(new Set<OscillatorNode>());
  const silence = useCallback(() => {
    active.current.forEach((node) => { try { node.stop(); } catch { /* Already ended. */ } });
    active.current.clear();
  }, []);
  useEffect(() => {
    const onVisibility = () => { if (document.hidden) silence(); };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      silence();
      void context.current?.close().catch(() => {});
      context.current = null;
    };
  }, [silence]);
  const play = useCallback((forming: boolean) => {
    if (muted || document.hidden || !window.AudioContext) return;
    try {
      const audio = context.current ??= new AudioContext();
      void audio.resume().catch(() => {});
      const node = audio.createOscillator();
      const gain = audio.createGain();
      const now = audio.currentTime;
      node.type = "sine";
      node.frequency.setValueAtTime(forming ? 260 : 780, now);
      node.frequency.exponentialRampToValueAtTime(forming ? 700 : 160, now + .09);
      gain.gain.setValueAtTime(.0001, now);
      gain.gain.exponentialRampToValueAtTime(.045, now + .008);
      gain.gain.exponentialRampToValueAtTime(.0001, now + .12);
      node.connect(gain).connect(audio.destination);
      active.current.add(node);
      node.onended = () => { active.current.delete(node); node.disconnect(); gain.disconnect(); };
      node.start(now);
      node.stop(now + .13);
    } catch { /* Sound availability never blocks discovery. */ }
  }, [muted]);
  const toggle = () => { silence(); setMuted((value) => !value); };
  return { muted, toggle, play };
}
