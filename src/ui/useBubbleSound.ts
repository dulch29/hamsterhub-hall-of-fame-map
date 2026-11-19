import { useCallback, useEffect, useRef, useState } from "react";

export function useBubbleSound() {
  const [muted, setMuted] = useState(false);
  const context = useRef<AudioContext | null>(null);
  const clips = useRef<Partial<Record<"pop" | "form", AudioBuffer>>>({});
  const active = useRef(new Set<AudioBufferSourceNode>());
  const silence = useCallback(() => {
    active.current.forEach((node) => { try { node.stop(); } catch { /* Already ended. */ } });
    active.current.clear();
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    if (window.AudioContext) try {
      const audio = context.current = new AudioContext();
      for (const kind of ["pop", "form"] as const) {
        void fetch(`/audio/bubble-${kind}.wav`, { signal: controller.signal })
          .then((response) => { if (!response.ok) throw new Error("Bubble audio unavailable"); return response.arrayBuffer(); })
          .then((bytes) => audio.decodeAudioData(bytes))
          .then((buffer) => { if (!controller.signal.aborted) clips.current[kind] = buffer; })
          .catch(() => {});
      }
    } catch { /* Audio support never blocks discovery. */ }
    const onVisibility = () => { if (document.hidden) silence(); };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      controller.abort();
      document.removeEventListener("visibilitychange", onVisibility);
      silence();
      void context.current?.close().catch(() => {});
      context.current = null;
      clips.current = {};
    };
  }, [silence]);
  const play = useCallback((forming: boolean) => {
    const audio = context.current;
    const buffer = clips.current[forming ? "form" : "pop"];
    if (muted || document.hidden || !audio || !buffer) return;
    try {
      void audio.resume().catch(() => {});
      const node = audio.createBufferSource();
      const gain = audio.createGain();
      const now = audio.currentTime;
      const offset = forming ? .026 : .034;
      node.buffer = buffer;
      gain.gain.setValueAtTime(forming ? .32 : .28, now);
      gain.gain.setTargetAtTime(0, now + buffer.duration - offset - .025, .008);
      node.connect(gain).connect(audio.destination);
      active.current.add(node);
      node.onended = () => { active.current.delete(node); node.disconnect(); gain.disconnect(); };
      node.start(now, offset);
    } catch { /* Sound availability never blocks discovery. */ }
  }, [muted]);
  const toggle = () => { silence(); setMuted((value) => !value); };
  return { muted, toggle, play };
}
