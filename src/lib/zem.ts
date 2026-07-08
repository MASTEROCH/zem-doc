/** Мини-шина: открыть чат dr.Zem из любого места (CTA, хедер, меню). */
const listeners = new Set<(seed?: string) => void>();

export function openZem(seed?: string) {
  listeners.forEach((l) => l(seed));
}
export function onOpenZem(fn: (seed?: string) => void) {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}
