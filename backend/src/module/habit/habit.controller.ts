import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { HabitService } from './habit.service';
import { UserId } from 'src/app/user.decorator';
import { CreateHabitDto, UpdateHabitDto } from './dto/habit.dto';

@Controller('habit')
export class HabitController {
  constructor(private readonly habitService: HabitService) {}

  @Post()
  create(@UserId() userId: number, @Body() dto: CreateHabitDto) {
    return this.habitService.create(userId, dto);
  }

  @Get()
  findAll(@UserId() userId: number, @Query('date') date?: string) {
    return this.habitService.findAll(userId, date);
  }

  @Post(':id/toggle')
  toggleCompletion(
    @UserId() userId: number,
    @Param('id') id: string,
    @Body('date') date: string,
    @Body('note') note?: string,
  ) {
    return this.habitService.toggleCompletion(userId, +id, date, note);
  }

  @Get(':id/detail')
  getHabitDetail(@UserId() userId: number, @Param('id') id: string) {
    return this.habitService.getHabitDetail(userId, +id);
  }

  @Get(':id')
  findOne(@UserId() userId: number, @Param('id') id: string) {
    return this.habitService.findOne(userId, +id);
  }

  @Put(':id')
  update(
    @UserId() userId: number,
    @Param('id') id: string,
    @Body() dto: UpdateHabitDto,
  ) {
    return this.habitService.update(userId, +id, dto);
  }

  @Delete(':id')
  remove(@UserId() userId: number, @Param('id') id: string) {
    return this.habitService.remove(userId, +id);
  }
}
