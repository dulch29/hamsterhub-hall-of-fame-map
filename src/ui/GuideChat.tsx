import { useEffect, useRef } from 'react';
import type { AwardGroup } from '../data/demoAwards';
import type { GuideDataset, GuideTarget } from '../guide/contract';
import { guideNavigation } from '../guide/navigation';
import type { useGuideChat } from './useGuideChat';

export function GuideChat({ chat, groups, dataset, onTarget }: {
  chat: ReturnType<typeof useGuideChat>; groups: AwardGroup[]; dataset: GuideDataset;
  onTarget: (target: GuideTarget) => void;
}) {
  const messagesRef = useRef<HTMLDivElement>(null);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = messagesRef.current;
    const lastTurn = chat.turns[chat.turns.length - 1];
    if (container && !chat.loading && !chat.error && lastTurn && lastTurn.role !== 'user') {
      const turnEls = container.querySelectorAll<HTMLElement>('.guide-chat__turn');
      const guideEl = turnEls[turnEls.length - 1];
      const userEl = turnEls.length >= 2 ? turnEls[turnEls.length - 2] : undefined;
      if (guideEl) {
        const anchorEl = userEl && guideEl.offsetTop - userEl.offsetTop < container.clientHeight * 0.45
          ? userEl
          : guideEl;
        container.scrollTop = Math.max(0, anchorEl.offsetTop - container.offsetTop);
        return;
      }
    }
    end.current?.scrollIntoView({ block: 'nearest' });
  }, [chat.turns.length, chat.loading, chat.error]);
  return <section className="guide-chat" aria-label="คุยกับ Guide">
    <h3 className="visually-hidden">ถาม Guide</h3>
    <p className="guide-chat__scope visually-hidden">Gemini ตอบเกี่ยวกับข้อมูลสมมติเท่านั้น · ไม่รวมข้อมูลเจ้าของผลงานจริง</p>
    <div ref={messagesRef} className="guide-chat__messages" role="log" aria-label="บทสนทนากับ Guide" aria-live="polite" aria-relevant="additions text">
      {chat.turns.map((turn, index) => {
        const resolvedActions = (turn.actions ?? []).flatMap((action) => {
          const navigation = guideNavigation(action, groups, dataset);
          return navigation ? [{ action, navigation }] : [];
        });
        return <div className="guide-chat__turn" data-role={turn.role} key={index}>
          <strong>{turn.role === 'user' ? 'คุณ' : 'Guide'}</strong><p>{turn.text}</p>
          {resolvedActions.length > 0 && (
            <>
              <p className="guide-chat__confirm">ให้ฉันเปิดหน้านี้ให้เลยไหม?</p>
              {resolvedActions.map(({ action, navigation }) => (
                <button key={`${action.kind}:${action.id}`} data-guide-target={`${action.kind}:${action.id}`}
                  onClick={() => onTarget(action)}>เปิด {navigation.label}<span aria-hidden="true"> ↗</span></button>
              ))}
            </>
          )}
        </div>;
      })}
      {chat.loading && <p role="status">Guide กำลังคิด…</p>}
      {chat.error && <p className="guide-chat__error" role="alert">{chat.error}</p>}
      <div ref={end} />
    </div>
    <form onSubmit={(event) => { event.preventDefault(); void chat.submit(); }}>
      <label htmlFor="guide-question" className="visually-hidden">อยากรู้เกี่ยวกับผลงานไหน?</label>
      <div className="guide-chat__bar">
        <textarea id="guide-question" rows={1} maxLength={1000} value={chat.question} disabled={chat.loading}
          onChange={(event) => chat.setQuestion(event.currentTarget.value)} placeholder="ถามฉันได้เลย…"
          onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); void chat.submit(); } }} />
        {chat.loading ? <button type="button" className="guide-chat__stop" onClick={(event) => { event.preventDefault(); chat.stop(); }}>หยุดคำตอบ</button>
          : <button type="submit" className="guide-chat__send" aria-label={chat.error ? 'ลองถามอีกครั้ง' : 'ส่งคำถาม'}
            disabled={!chat.question.trim()}>
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 10 4 15 9 20" /><path d="M20 4v7a4 4 0 0 1-4 4H4" />
            </svg></button>}
      </div>
    </form>
  </section>;
}
