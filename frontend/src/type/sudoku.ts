export type CellStatus = "fixed" | "empty" | "correct" | "wrong";

export interface Cell {
  row: number;
  col: number;
  answer: number;
  inputValue?: number;
  status: CellStatus;
}

export interface SudokuSettings {
  showRemaining: boolean;
  enableHints: boolean;
  useLive: boolean;
}
