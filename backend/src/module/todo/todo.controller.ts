import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { UserId } from 'src/app/user.decorator';
import { TodoService } from './todo.service';
import { CreateTodoDto, UpdateTodoDto } from './dto/todo.dto';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  create(@UserId() userId: number, @Body() dto: CreateTodoDto) {
    return this.todoService.create(userId, dto);
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
  update(
    @UserId() userId: number,
    @Param('id') id: string,
    @Body() dto: UpdateTodoDto,
  ) {
    return this.todoService.update(userId, +id, dto);
  }

  @Delete(':id')
  remove(@UserId() userId: number, @Param('id') id: string) {
    return this.todoService.remove(userId, +id);
  }
}
