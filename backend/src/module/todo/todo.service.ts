import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoEntity } from './todo.entity';
import { CreateTodoDto, UpdateTodoDto } from './dto/todo.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>,
  ) {}

  async create(userId: number, dto: CreateTodoDto) {
    const todo = this.todoRepository.create({
      ...dto,
      userId,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
    });
    return await this.todoRepository.save(todo);
  }

  async findAll(userId: number) {
    return await this.todoRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(userId: number, id: number) {
    const todo = await this.todoRepository.findOne({
      where: { id, userId },
    });
    if (!todo) {
      throw new NotFoundException('Todo item not found');
    }
    return todo;
  }

  async update(userId: number, id: number, dto: UpdateTodoDto) {
    const todo = await this.findOne(userId, id);

    if (dto.isDone === true && !todo.isDone) {
      dto.completedAt = new Date().toISOString();
    } else if (dto.isDone === false) {
      dto.completedAt = undefined;
    }

    const updateData: any = { ...dto };
    if (dto.dueDate) updateData.dueDate = new Date(dto.dueDate);
    if (dto.completedAt) updateData.completedAt = new Date(dto.completedAt);
    if (dto.completedAt === undefined) updateData.completedAt = null;

    await this.todoRepository.update({ id, userId }, updateData);
    return await this.findOne(userId, id);
  }

  async remove(userId: number, id: number) {
    const todo = await this.findOne(userId, id);
    await this.todoRepository.delete({ id, userId });
    return { success: true, deletedId: id };
  }
}
