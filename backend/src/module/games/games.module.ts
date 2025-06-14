import { Module } from '@nestjs/common';
import { SudokuController } from './sudoku/sudoku.controller';
import { SudokuService } from './sudoku/sudoku.service';

@Module({
  controllers: [SudokuController],
  providers: [SudokuService],
})
export class GamesModule {}
