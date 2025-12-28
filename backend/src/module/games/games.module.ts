import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SudokuController } from './sudoku/sudoku.controller';
import { SudokuService } from './sudoku/sudoku.service';
import { SudokuLogEntity } from './sudoku/sudoku-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SudokuLogEntity])],
  controllers: [SudokuController],
  providers: [SudokuService],
})
export class GamesModule {}
