export function range(start: number, count: number) {
  return Array.from({ length: count }, (_, i) => i + start);
}
