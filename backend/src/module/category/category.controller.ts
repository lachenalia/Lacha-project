import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { UserId } from '../../app/user.decorator';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findAll(@UserId() userId: number) {
    return this.categoryService.findAll(userId);
  }

  @Post()
  create(
    @UserId() userId: number,
    @Body('name') name: string,
    @Body('color') color: string,
    @Body('icon') icon?: string,
  ) {
    return this.categoryService.create(userId, name, color, icon);
  }

  @Put(':id')
  update(
    @UserId() userId: number,
    @Param('id') id: string,
    @Body('name') name: string,
    @Body('color') color: string,
    @Body('icon') icon?: string,
  ) {
    return this.categoryService.update(userId, +id, name, color, icon);
  }

  @Delete(':id')
  remove(@UserId() userId: number, @Param('id') id: string) {
    return this.categoryService.remove(userId, +id);
  }
}
