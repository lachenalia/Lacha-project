export async function fetchSudoku() {
  const res = await fetch("/api/sudoku");
  if (!res.ok) throw new Error("API Call Fail");
  return res.json();
}

export default fetchSudoku;
