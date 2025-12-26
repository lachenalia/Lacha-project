import { Injectable } from '@nestjs/common';

@Injectable()
export class HabitService {
  create(userId: number, body: any) {
    return 'This action adds a new habit';
  }

  findAll(userId: number) {
    return `This action returns all habit for user ${userId}`;
  }

  findOne(userId: number, id: number) {
    return `This action returns a #${id} habit`;
  }

  update(userId: number, id: number, body: any) {
    return `This action updates a #${id} habit`;
  }

  remove(userId: number, id: number) {
    return `This action removes a #${id} habit`;
  }
}
