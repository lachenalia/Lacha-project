import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { UserId } from 'src/app/user.decorator';
import { TodoService } from './todo.service';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  create(@UserId() userId: number, @Body() body: any) {
    return this.todoService.create(userId, body);
  }

  @Get()
  findAll(@UserId() userId: number) {
    return this.todoService.findAll(userId);
  }

  @Get(':id')
  findOne(@UserId() userId: number, @Param('id') id: string) {
    return this.todoService.findOne(userId, +id);
  }

  @Put(':id')
  update(@UserId() userId: number, @Param('id') id: string, @Body() body: any) {
    return this.todoService.update(userId, +id, body);
  }

  @Delete(':id')
  remove(@UserId() userId: number, @Param('id') id: string) {
    return this.todoService.remove(userId, +id);
  }
}
