const encoder = new TextEncoder();

export function hashId(id: string): number {
  let hash = 0x811c9dc5;
  for (const byte of encoder.encode(id)) {
    hash = Math.imul(hash ^ byte, 0x01000193) >>> 0;
  }
  return hash;
}
