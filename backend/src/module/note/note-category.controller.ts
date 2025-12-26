import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { UserId } from 'src/app/user.decorator';
import { NoteCategoryService } from './note-category.service';
import { CreateNoteCategoryDTO } from './dto/create-note-category.dto';

@Controller('note-category')
export class NoteCategoryController {
  constructor(private readonly categoryService: NoteCategoryService) {}

  @Get()
  findAll(@UserId() userId: number) {
    return this.categoryService.findAll(userId);
  }

  @Post()
  create(@UserId() userId: number, @Body() dto: CreateNoteCategoryDTO) {
    return this.categoryService.create(userId, dto);
  }

  @Put(':id')
  update(
    @UserId() userId: number,
    @Param('id') id: string,
    @Body() dto: CreateNoteCategoryDTO,
  ) {
    return this.categoryService.update(userId, +id, dto);
  }

  @Delete(':id')
  remove(@UserId() userId: number, @Param('id') id: string) {
    return this.categoryService.remove(userId, +id);
  }
}
