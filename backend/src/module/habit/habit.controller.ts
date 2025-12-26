import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { HabitService } from './habit.service';
import { UserId } from 'src/app/user.decorator';

@Controller('habit')
export class HabitController {
  constructor(private readonly habitService: HabitService) {}

  @Post()
  create(@UserId() userId: number, @Body() body: any) {
    return this.habitService.create(userId, body);
  }

  @Get()
  findAll(@UserId() userId: number) {
    return this.habitService.findAll(userId);
  }

  @Get(':id')
  findOne(@UserId() userId: number, @Param('id') id: string) {
    return this.habitService.findOne(userId, +id);
  }

  @Put(':id')
  update(@UserId() userId: number, @Param('id') id: string, @Body() body: any) {
    return this.habitService.update(userId, +id, body);
  }

  @Delete(':id')
  remove(@UserId() userId: number, @Param('id') id: string) {
    return this.habitService.remove(userId, +id);
  }
}
