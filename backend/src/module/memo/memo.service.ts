import { Injectable } from '@nestjs/common';

@Injectable()
export class MemoService {
  create(userId: number, body: any) {
    return 'This action adds a new memo';
  }

  findAll(userId: number) {
    return `This action returns all memo for user ${userId}`;
  }

  findOne(userId: number, id: number) {
    return `This action returns a #${id} memo`;
  }

  update(userId: number, id: number, body: any) {
    return `This action updates a #${id} memo`;
  }

  remove(userId: number, id: number) {
    return `This action removes a #${id} memo`;
  }
}
