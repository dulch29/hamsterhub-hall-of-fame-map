import { useCallback, useEffect, useRef, useState } from "react";
import { isForwardNarration, type NarrationSelection } from "./guideContent";

type SpeechStatus = "off" | "ready" | "speaking" | "text";
export function useNarration(text: string, selection: NarrationSelection, paused: boolean) {
  const [enabled, setEnabled] = useState(false);
  const [status, setStatus] = useState<SpeechStatus>("off");
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const generation = useRef(0);
  const previous = useRef(selection);
  const current = useRef({ text, paused });
  current.current = { text, paused };
  const stop = useCallback(() => {
    generation.current++;
    window.speechSynthesis?.cancel();
    setStatus((value) => value === "speaking" ? "ready" : value);
  }, []);
  useEffect(() => {
    if (!window.speechSynthesis || typeof window.SpeechSynthesisUtterance !== "function") return;
    const load = () => setVoice(window.speechSynthesis.getVoices().find((candidate) =>
      /^th(?:-|$)/i.test(candidate.lang) && candidate.localService) ?? null);
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    const hide = () => { if (document.hidden) stop(); };
    document.addEventListener("visibilitychange", hide);
    return () => {
      generation.current++;
      window.speechSynthesis.cancel();
      window.speechSynthesis.removeEventListener("voiceschanged", load);
      document.removeEventListener("visibilitychange", hide);
    };
  }, [stop]);
  const speak = useCallback(() => {
    stop();
    if (current.current.paused || document.hidden) return;
    if (!voice || typeof window.SpeechSynthesisUtterance !== "function") { setStatus("text"); return; }
    const token = generation.current;
    try {
      const utterance = new SpeechSynthesisUtterance(current.current.text);
      utterance.voice = voice; utterance.lang = "th-TH"; utterance.rate = .95;
      utterance.onend = () => { if (generation.current === token) setStatus("ready"); };
      utterance.onerror = () => { if (generation.current === token) setStatus("text"); };
      setStatus("speaking");
      window.speechSynthesis.speak(utterance);
    } catch { setStatus("text"); }
  }, [voice, stop]);
  useEffect(() => {
    if (paused) stop();
  }, [paused, stop]);
  useEffect(() => {
    if (selection.key === previous.current.key) return;
    const forward = isForwardNarration(previous.current, selection);
    previous.current = selection;
    stop();
    if (forward && enabled) speak();
  }, [selection, enabled, speak, stop]);
  useEffect(() => { if (enabled && !voice) { stop(); setStatus("text"); } }, [voice, enabled, stop]);
  const toggle = () => {
    if (enabled) { stop(); setEnabled(false); setStatus("off"); }
    else { setEnabled(true); speak(); }
  };
  return { enabled, status, toggle, stop, replay: () => { if (enabled) speak(); } };
}
