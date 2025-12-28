import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { HabitCategoryService } from './habit-category.service';
import { UserId } from '../../app/user.decorator';

@Controller('habit-category')
export class HabitCategoryController {
  constructor(private readonly habitCategoryService: HabitCategoryService) {}

  @Get()
  findAll(@UserId() userId: number) {
    return this.habitCategoryService.findAll(userId);
  }

  @Post()
  create(
    @UserId() userId: number,
    @Body('name') name: string,
    @Body('icon') icon: string,
  ) {
    return this.habitCategoryService.create(userId, name, icon);
  }

  @Put(':id')
  update(
    @UserId() userId: number,
    @Param('id') id: string,
    @Body('name') name: string,
    @Body('icon') icon: string,
  ) {
    return this.habitCategoryService.update(userId, +id, name, icon);
  }

  @Delete(':id')
  remove(@UserId() userId: number, @Param('id') id: string) {
    return this.habitCategoryService.remove(userId, +id);
  }
}
