import { Injectable } from '@nestjs/common';

@Injectable()
export class TodoService {
  create(userId: number, body: any) {
    return 'This action adds a new todo';
  }

  findAll(userId: number) {
    return `This action returns all todo for user ${userId}`;
  }

  findOne(userId: number, id: number) {
    return `This action returns a #${id} todo`;
  }

  update(userId: number, id: number, body: any) {
    return `This action updates a #${id} todo`;
  }

  remove(userId: number, id: number) {
    return `This action removes a #${id} todo`;
  }
}
