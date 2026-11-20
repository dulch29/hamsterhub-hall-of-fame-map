import { useCallback, useEffect, useRef, useState } from 'react';
import type { GuideDataset, GuideMessage, GuideReply, GuideTarget } from '../guide/contract';

type Turn = GuideMessage & { actions?: GuideTarget[] };
const errors: Record<string, string> = {
  NOT_CONFIGURED: 'Guide ยังไม่ได้เชื่อมต่อ Gemini เลือกดูผลงานด้านล่างได้เลย',
  RATE_LIMIT: 'Guide รับคำถามครบช่วงนี้แล้ว กรุณารอสักครู่แล้วลองอีกครั้ง',
  TIMEOUT: 'Guide ตอบไม่ทัน กรุณาลองอีกครั้ง หรือเลือกดูผลงานได้ด้วยตัวเอง',
};

export function useGuideChat(open: boolean, dataset: GuideDataset, context: string | undefined) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const pending = useRef<AbortController | null>(null);
  const generation = useRef(0);
  const stop = useCallback(() => {
    generation.current++; pending.current?.abort(); pending.current = null; setLoading(false);
  }, []);
  useEffect(() => { if (!open) stop(); }, [open, stop]);
  useEffect(() => () => { generation.current++; pending.current?.abort(); }, []);
  const submit = async () => {
    const message = question.trim();
    if (!message || message.length > 1000 || pending.current) return;
    const controller = new AbortController();
    const token = ++generation.current;
    pending.current = controller; setLoading(true); setError('');
    const deadline = setTimeout(() => controller.abort(), 25_000);
    try {
      const response = await fetch('/api/guide', { method: 'POST', signal: controller.signal,
        headers: { 'Content-Type': 'application/json' }, cache: 'no-store',
        body: JSON.stringify({ dataset, message, history: turns.slice(-6).map(({ role, text }) => ({ role, text })), context }),
      });
      const raw = await response.text();
      if (raw.length > 32_000) throw new Error('INVALID_REPLY');
      const value = JSON.parse(raw);
      if (!response.ok) throw new Error(typeof value.error?.code === 'string' ? value.error.code : 'UNAVAILABLE');
      if (typeof value.text !== 'string' || !value.text.trim() || value.text.length > 2000
        || !Array.isArray(value.actions) || value.actions.length > 5 || !value.actions.every((action: GuideTarget) => action
          && ['province', 'student', 'project'].includes(action.kind) && typeof action.id === 'string' && action.id.length <= 180)) throw new Error('INVALID_REPLY');
      if (token !== generation.current) return;
      const reply = value as GuideReply;
      setTurns((previous) => [...previous, { role: 'user' as const, text: message }, { role: 'assistant' as const, text: reply.text, actions: reply.actions }].slice(-8));
      setQuestion('');
    } catch (failure) {
      if (token === generation.current) setError(controller.signal.aborted ? errors.TIMEOUT! : errors[failure instanceof Error ? failure.message : '']
        ?? 'Guide ไม่พร้อมตอบตอนนี้ กรุณาลองอีกครั้ง หรือเลือกดูผลงานด้านล่าง');
    } finally {
      clearTimeout(deadline);
      if (token === generation.current) { pending.current = null; setLoading(false); }
    }
  };
  return { turns, question, setQuestion, loading, error, submit, stop,
    clear: () => { stop(); setTurns([]); setQuestion(''); setError(''); } };
}
