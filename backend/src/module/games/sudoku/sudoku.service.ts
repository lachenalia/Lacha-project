import { Injectable } from '@nestjs/common';
import { range, shuffle } from 'src/common/utils';

@Injectable()
export class SudokuService {
  constructor() {}

  getNewGame(difficulty: string) {
    const solution = this.createNewBoard();
    const puzzle = solution.map((row) => [...row]); // Deep copy 1 depth
    // Or full deep copy if safe: JSON.parse(JSON.stringify(solution))

    let dropCount = 30;
    if (difficulty === 'medium') dropCount = 40;
    if (difficulty === 'hard') dropCount = 50;

    this.#removeNumbers(puzzle, dropCount);

    return { solution, puzzle };
  }

  #removeNumbers(board: number[][], count: number) {
    let removed = 0;
    while (removed < count) {
      const r = Math.floor(Math.random() * 9);
      const c = Math.floor(Math.random() * 9);
      if (board[r][c] !== 0) {
        board[r][c] = 0;
        removed++;
      }
    }
  }

  createNewBoard() {
    const board = Array.from({ length: 9 }, () =>
      Array.from({ length: 9 }, () => 0),
    );
    console.log(board);
    this.#solveBoard(board);

    return board;
  }

  #solveBoard(board: number[][]) {
    for (const r of range(0, 9)) {
      for (const c of range(0, 9)) {
        if (board[r][c] == 0) {
          const numbers = shuffle(range(1, 9));
          for (const n of numbers) {
            if (this.#isValid(board, r, c, n)) {
              console.log(r, c, n);
              board[r][c] = n;
              if (this.#solveBoard(board)) return true;
              board[r][c] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  #isValid(board: number[][], r: number, c: number, num: number): boolean {
    if (board[r].includes(num)) return false;

    for (const row of board) {
      if (row[c] === num) return false;
    }

    const start_row = 3 * Math.floor(r / 3);
    const start_col = 3 * Math.floor(c / 3);

    for (const i of range(0, 3)) {
      for (const j of range(0, 3)) {
        if (board[start_row + i][start_col + j] === num) return false;
      }
    }

    return true;
  }
}
