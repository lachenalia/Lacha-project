export function range(start: number, count: number) {
  return Array.from({ length: count }, (_, i) => i + start);
}

export function shuffle(array: number[]): number[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
