import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { TodoEntity } from './todo.entity';
import { CategoryEntity } from '../category/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TodoEntity, CategoryEntity])],
  controllers: [TodoController],
  providers: [TodoService],
  exports: [TodoService],
})
export class TodoModule {}
