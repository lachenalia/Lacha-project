export class CreateSudokuLogDto {
  difficulty!: number;
  result!: boolean;
  playTimeSec!: number;
  useHint!: number;
  lifeLost!: number;
  attemptCount!: number;
}
