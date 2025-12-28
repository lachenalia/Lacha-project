import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SudokuService } from './sudoku.service';
import { UserId } from '../../../app/user.decorator';
import { CreateSudokuLogDto } from './dto/sudoku-log.dto';

@Controller('sudoku')
export class SudokuController {
  constructor(private readonly service: SudokuService) {}

  @Get('')
  getNew(@Query('difficulty') difficulty: string = 'easy') {
    return this.service.getNewGame(difficulty);
  }

  @Post('log')
  saveLog(@UserId() userId: number, @Body() dto: CreateSudokuLogDto) {
    return this.service.saveLog(userId, dto);
  }
}
