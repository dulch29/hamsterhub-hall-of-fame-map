export type GuideDataset = 'default' | 'group' | 'review';
export type GuideTarget = { kind: 'province' | 'student' | 'project'; id: string; label: string };
export type GuideRecord = GuideTarget & { key: string; description: string };
export type GuideMessage = { role: 'user' | 'assistant'; text: string };
export type GuideReply = { text: string; actions: GuideTarget[] };
export type GuideRequest = { dataset: GuideDataset; message: string; history: GuideMessage[]; context?: string };
const object = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
const text = (value: unknown, limit: number): value is string => typeof value === 'string' && value.trim().length > 0 && value.length <= limit;

export function parseGuideRequest(value: unknown): GuideRequest | null {
  if (!object(value) || Object.keys(value).some((key) => !['dataset', 'message', 'history', 'context'].includes(key))
    || !['default', 'group', 'review'].includes(value.dataset as string) || !text(value.message, 1000)
    || !Array.isArray(value.history) || value.history.length > 6
    || !value.history.every((entry) => object(entry) && ['user', 'assistant'].includes(entry.role as string) && text(entry.text, 2000))
    || (value.context !== undefined && !text(value.context, 180))) return null;
  return { dataset: value.dataset as GuideDataset, message: value.message.trim(),
    history: value.history.map((entry) => ({ role: entry.role, text: entry.text })), context: value.context as string | undefined };
}

export function parseGuideReply(value: unknown, catalog: readonly GuideRecord[]): GuideReply {
  if (!object(value) || !text(value.text, 2000) || !Array.isArray(value.targets)
    || value.targets.length > 5 || !value.targets.every((target) => typeof target === 'string')) throw new Error('Invalid Guide reply');
  const keys = new Set(value.targets);
  return { text: value.text.trim(), actions: catalog.filter((entry) => keys.has(entry.key))
    .map(({ kind, id, label }) => ({ kind, id, label })).slice(0, 5) };
}
