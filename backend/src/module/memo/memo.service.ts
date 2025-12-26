import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MemoEntity } from './memo.entity';
import { MemoDTO } from './dto/memo.dto';

@Injectable()
export class MemoService {
  constructor(
    @InjectRepository(MemoEntity)
    private readonly memoRepo: Repository<MemoEntity>,
  ) {}

  async create(userId: number, dto: MemoDTO) {
    const { title, content, categoryId } = dto;
    const memo = this.memoRepo.create({
      userId,
      title,
      content,
      categoryId: categoryId ?? undefined,
    });
    return await this.memoRepo.save(memo);
  }

  async findAll(userId: number) {
    return await this.memoRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(userId: number, id: number) {
    const memo = await this.memoRepo.findOne({
      where: { id, userId },
    });
    if (!memo) {
      throw new NotFoundException(`Memo with ID ${id} not found`);
    }
    return memo;
  }

  async update(userId: number, id: number, body: MemoDTO) {
    const memo = await this.findOne(userId, id);
    const { title, content, categoryId } = body;
    
    // Update fields if they exist in body
    if (title !== undefined) memo.title = title;
    if (content !== undefined) memo.content = content;
    if (categoryId !== undefined) memo.categoryId = categoryId;

    return await this.memoRepo.save(memo);
  }

  async remove(userId: number, id: number) {
    const memo = await this.findOne(userId, id);
    // Soft delete
    await this.memoRepo.softRemove(memo);
    return { result: true };
  }
}
