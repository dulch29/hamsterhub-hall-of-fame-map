import { useCallback, useEffect, useRef, useState } from 'react';
import type { GuideDataset, GuideMessage, GuideReply, GuideTarget } from '../guide/contract';

type Turn = GuideMessage & { actions?: GuideTarget[] };
const errors: Record<string, string> = {
  NOT_CONFIGURED: 'Guide ยังไม่ได้เชื่อมต่อ Gemini เลือกดูผลงานด้านล่างได้เลย',
  RATE_LIMIT: 'Guide รับคำถามครบช่วงนี้แล้ว กรุณารอสักครู่แล้วลองอีกครั้ง',
  TIMEOUT: 'Guide ตอบไม่ทัน กรุณาลองอีกครั้ง หรือเลือกดูผลงานได้ด้วยตัวเอง',
};

const MAX_REPLY_BYTES = 32 * 1024;

export async function readBoundedReply(response: Response, limit = MAX_REPLY_BYTES): Promise<string> {
  if (!response.body) {
    const text = await response.text();
    if (new TextEncoder().encode(text).byteLength > limit) throw new Error('INVALID_REPLY');
    return text;
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let bytes = 0;
  let result = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > limit) {
        await reader.cancel().catch(() => {});
        throw new Error('INVALID_REPLY');
      }
      result += decoder.decode(value, { stream: true });
    }
    return result + decoder.decode();
  } finally {
    reader.releaseLock();
  }
}

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
      const raw = await readBoundedReply(response);
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
