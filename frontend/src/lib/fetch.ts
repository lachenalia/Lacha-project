import { apiGet } from "@/lib/api";

export async function fetchSudoku() {
  return apiGet("/sudoku");
}

export default fetchSudoku;
