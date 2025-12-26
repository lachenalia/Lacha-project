import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { UserId } from 'src/app/user.decorator';
import { GoalService } from './goal.service';

@Controller('goal')
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  @Post()
  create(@UserId() userId: number, @Body() body: any) {
    return this.goalService.create(userId, body);
  }

  @Get()
  findAll(@UserId() userId: number) {
    return this.goalService.findAll(userId);
  }

  @Get(':id')
  findOne(@UserId() userId: number, @Param('id') id: string) {
    return this.goalService.findOne(userId, +id);
  }

  @Put(':id')
  update(@UserId() userId: number, @Param('id') id: string, @Body() body: any) {
    return this.goalService.update(userId, +id, body);
  }

  @Delete(':id')
  remove(@UserId() userId: number, @Param('id') id: string) {
    return this.goalService.remove(userId, +id);
  }
}
