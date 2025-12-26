import { Injectable } from '@nestjs/common';

@Injectable()
export class GoalService {
  create(userId: number, body: any) {
    return 'This action adds a new goal';
  }

  findAll(userId: number) {
    return `This action returns all goal for user ${userId}`;
  }

  findOne(userId: number, id: number) {
    return `This action returns a #${id} goal`;
  }

  update(userId: number, id: number, body: any) {
    return `This action updates a #${id} goal`;
  }

  remove(userId: number, id: number) {
    return `This action removes a #${id} goal`;
  }
}
