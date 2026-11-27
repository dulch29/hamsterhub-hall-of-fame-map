import { useEffect, useRef } from 'react';
import type { AwardGroup } from '../data/demoAwards';
import type { GuideDataset, GuideTarget } from '../guide/contract';
import { guideNavigation } from '../guide/navigation';
import type { useGuideChat } from './useGuideChat';

const AFFIRMATIVE_RE = /^(ได้|ได้เลย|ได้ครับ|ได้ค่ะ|ได้เลยครับ|ได้เลยค่ะ|เปิด|เปิดเลย|เปิดเลยครับ|เปิดเลยค่ะ|เปิดให้หน่อย|เปิดให้เลย|เปิดดูหน่อย|เอาเลย|เอาเลยครับ|เอาเลยค่ะ|ตกลง|ตกลงครับ|ตกลงค่ะ|โอเค|โอเคครับ|โอเคค่ะ|จัดไป|ใช่|ใช่ครับ|ใช่ค่ะ|ครับ|ค่ะ|ครับผม|ok|okay|yes|yep|yeah|sure|open|go|go ahead)(?:\s*(?:นะ|จ้า|จ๊ะ|ครับ|ค่ะ))?[!.~]*$/i;

export function isAffirmativeReply(message: string): boolean {
  return AFFIRMATIVE_RE.test(message.trim());
}

export function guideIntroForContext(context?: string): {
  leadPrefix?: string;
  highlight: string;
  body: string;
  chips: readonly string[];
} {
  if (context?.startsWith('project:')) {
    return {
      highlight: 'กำลังดูผลงานนี้อยู่ใช่ไหมครับ?',
      body: 'ถามรายละเอียดเพิ่มเติม หรือให้พาไปดูผลงานอื่นต่อได้เลย',
      chips: ['สรุปผลงานนี้สั้นๆ หน่อย', 'มีผลงานแนวคล้ายกันอีกไหม?', 'แนะนำผลงานอื่นน่าสนใจ'],
    };
  }
  if (context?.startsWith('student:') || context?.startsWith('province:')) {
    return {
      highlight: 'อยากให้ช่วยแนะนำผลงานในหน้านี้ไหมครับ?',
      body: 'ถามรายละเอียดเพิ่มเติม หรือให้พาไปดูจังหวัดอื่นได้เลย',
      chips: ['เล่าเรื่องผลงานในหน้านี้หน่อย', 'มีผลงานเกมน่าสนใจไหม?', 'แนะนำจังหวัดอื่นหน่อย'],
    };
  }
  return {
    leadPrefix: 'สวัสดีครับ! ',
    highlight: 'ฉันคือ Hamster Guide ของ Hall of Fame',
    body: 'อยากให้ช่วยหาผลงาน แนะนำเกม หรือพาไปเปิดหน้าไหน บอกได้เลยนะ',
    chips: ['แนะนำผลงานเกมน่าสนใจ', 'มีผลงานจาก NSC ไหม?', 'มีจังหวัดไหนบ้าง?'],
  };
}

export function GuideChat({ chat, groups, dataset, context, onTarget }: {
  chat: ReturnType<typeof useGuideChat>; groups: AwardGroup[]; dataset: GuideDataset;
  context?: string;
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
  const handleSubmit = (event?: { preventDefault: () => void }) => {
    event?.preventDefault();
    const message = chat.question.trim();
    if (!message) return;
    if (isAffirmativeReply(message)) {
      for (let i = chat.turns.length - 1; i >= 0; i--) {
        const prev = chat.turns[i];
        if (prev && prev.role === 'assistant' && prev.actions?.length) {
          const resolved = prev.actions.flatMap((action) => {
            const navigation = guideNavigation(action, groups, dataset);
            return navigation ? [{ action, navigation }] : [];
          });
          if (resolved.length === 1) {
            const [{ action, navigation }] = resolved as [{ action: GuideTarget; navigation: NonNullable<ReturnType<typeof guideNavigation>> }];
            chat.pushLocalTurn(message, `กำลังเปิดหน้า ${navigation.label} ให้เลยครับ`, [action]);
            onTarget(action);
            return;
          }
          break;
        }
      }
    }
    void chat.submit();
  };
  const intro = guideIntroForContext(context);
  return <section className="guide-chat" aria-label="คุยกับ Guide">
    <h3 className="visually-hidden">ถาม Guide</h3>
    <p className="guide-chat__scope visually-hidden">Gemini ตอบเกี่ยวกับผลงานนักเรียน Hamsterhub Hall of Fame</p>
    <div ref={messagesRef} className="guide-chat__messages" role="log" aria-label="บทสนทนากับ Guide" aria-live="polite" aria-relevant="additions text">
      {chat.turns.length === 0 && !chat.loading && !chat.error && (
        <div className="guide-chat__intro">
          <strong>Guide</strong>
          <p className="guide-chat__intro-lead">
            {intro.leadPrefix}
            <span className="guide-chat__intro-highlight">{intro.highlight}</span>
          </p>
          <p className="guide-chat__intro-sub">{intro.body}</p>
          <div className="guide-chat__chips" role="group" aria-label="คำถามแนะนำ">
            {intro.chips.map((chip) => (
              <button key={chip} type="button" className="guide-chat__chip" onClick={() => void chat.submit(chip)}>
                {chip}
              </button>
            ))}
          </div>
        </div>
      )}
      {chat.turns.map((turn, index) => {
        const resolvedActions = (turn.actions ?? []).flatMap((action) => {
          const navigation = guideNavigation(action, groups, dataset);
          return navigation ? [{ action, navigation }] : [];
        });
        return <div className="guide-chat__turn" data-role={turn.role} key={index}>
          <strong>{turn.role === 'user' ? 'คุณ' : 'Guide'}</strong><p>{turn.text}</p>
          {resolvedActions.length > 0 && (
            <>
              {!turn.text.includes('เปิดหน้านี้') && <p className="guide-chat__confirm">ให้ฉันเปิดหน้านี้ให้เลยไหม?</p>}
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
    <form onSubmit={handleSubmit}>
      <label htmlFor="guide-question" className="visually-hidden">อยากรู้เกี่ยวกับผลงานไหน?</label>
      <div className="guide-chat__bar">
        <textarea id="guide-question" rows={1} maxLength={1000} value={chat.question} disabled={chat.loading}
          onChange={(event) => chat.setQuestion(event.currentTarget.value)} placeholder="ถามฉันได้เลย…"
          onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); handleSubmit(); } }} />
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
