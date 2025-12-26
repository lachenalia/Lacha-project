import { Controller, Get, Query } from '@nestjs/common';
import { SudokuService } from './sudoku.service';

@Controller('sudoku')
export class SudokuController {
  constructor(private readonly service: SudokuService) {}

  @Get('')
  getNew(@Query('difficulty') difficulty: string = 'easy') {
    return this.service.getNewGame(difficulty);
  }
}
