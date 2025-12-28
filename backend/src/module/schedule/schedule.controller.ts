import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { UserId } from '../../app/user.decorator';

@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  findAll(@UserId() userId: number) {
    return this.scheduleService.findAll(userId);
  }

  @Get(':id')
  findOne(@UserId() userId: number, @Param('id') id: string) {
    return this.scheduleService.findOne(userId, +id);
  }

  @Post()
  create(@UserId() userId: number, @Body() dto: CreateScheduleDto) {
    return this.scheduleService.create(userId, dto);
  }

  @Put(':id')
  update(
    @UserId() userId: number,
    @Param('id') id: string,
    @Body() dto: UpdateScheduleDto,
  ) {
    return this.scheduleService.update(userId, +id, dto);
  }

  @Delete(':id')
  remove(@UserId() userId: number, @Param('id') id: string) {
    return this.scheduleService.remove(userId, +id);
  }
}
