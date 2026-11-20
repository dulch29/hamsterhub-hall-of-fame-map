import { useEffect, useRef } from 'react';
import type { AwardGroup } from '../data/demoAwards';
import type { GuideDataset, GuideTarget } from '../guide/contract';
import { guideNavigation } from '../guide/navigation';
import type { useGuideChat } from './useGuideChat';

export function GuideChat({ chat, groups, dataset, onTarget }: {
  chat: ReturnType<typeof useGuideChat>; groups: AwardGroup[]; dataset: GuideDataset;
  onTarget: (target: GuideTarget) => void;
}) {
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ block: 'nearest' }); }, [chat.turns.length, chat.loading, chat.error]);
  return <section className="guide-chat" aria-label="คุยกับ Guide">
    <h3>ถาม Guide</h3>
    <p className="guide-chat__scope">Gemini ตอบเกี่ยวกับข้อมูลสมมติเท่านั้น · ไม่รวมข้อมูลเจ้าของผลงานจริง</p>
    <div className="guide-chat__messages" role="log" aria-label="บทสนทนากับ Guide" aria-live="polite" aria-relevant="additions text">
      {chat.turns.map((turn, index) => <div className="guide-chat__turn" data-role={turn.role} key={index}>
        <strong>{turn.role === 'user' ? 'คุณ' : 'Guide'}</strong><p>{turn.text}</p>
        {turn.actions?.map((action) => {
          const navigation = guideNavigation(action, groups, dataset);
          return navigation && <button key={`${action.kind}:${action.id}`} data-guide-target={`${action.kind}:${action.id}`}
            onClick={() => onTarget(action)}>เปิด {navigation.label}<span aria-hidden="true"> ↗</span></button>;
        })}
      </div>)}
      {chat.loading && <p role="status">Guide กำลังคิด…</p>}
      {chat.error && <p className="guide-chat__error" role="alert">{chat.error}</p>}
      <div ref={end} />
    </div>
    <form onSubmit={(event) => { event.preventDefault(); void chat.submit(); }}>
      <label htmlFor="guide-question">อยากรู้เกี่ยวกับผลงานไหน?</label>
      <textarea id="guide-question" rows={2} maxLength={1000} value={chat.question} disabled={chat.loading}
        onChange={(event) => chat.setQuestion(event.currentTarget.value)} placeholder="เช่น มีผลงานเกี่ยวกับเขาวงกตไหม"
        onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); void chat.submit(); } }} />
      <div className="guide-chat__controls">
        {chat.loading ? <button type="button" onClick={(event) => { event.preventDefault(); chat.stop(); }}>หยุดคำตอบ</button>
          : <button type="submit" disabled={!chat.question.trim()}>{chat.error ? 'ลองถามอีกครั้ง' : 'ส่งคำถาม'}</button>}
        <button type="button" onClick={chat.clear} disabled={!chat.turns.length && !chat.question && !chat.loading}>ล้างบทสนทนา</button>
      </div>
    </form>
  </section>;
}
