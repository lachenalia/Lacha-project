import { Controller, Get } from '@nestjs/common';
import { SudokuService } from './sudoku.service';

@Controller('sudoku')
export class SudokuController {
  constructor(private readonly service: SudokuService) {}

  @Get('')
  getNew() {
    return this.service.getNewGame();
  }
}
