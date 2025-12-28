import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HabitEntity } from './habit.entity';
import { HabitLogEntity } from './habit-log.entity';
import { CategoryEntity } from '../category/category.entity';
import { HabitService } from './habit.service';
import { HabitController } from './habit.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HabitEntity,
      HabitLogEntity,
      CategoryEntity,
    ]),
  ],
  controllers: [HabitController],
  providers: [HabitService],
  exports: [HabitService],
})
export class HabitModule {}
