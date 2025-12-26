import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NoteCategoryEntity } from './note-category.entity';
import { CreateNoteCategoryDTO } from './dto/create-note-category.dto';

@Injectable()
export class NoteCategoryService {
  constructor(
    @InjectRepository(NoteCategoryEntity)
    private readonly categoryRepo: Repository<NoteCategoryEntity>,
  ) {}

  async findAll(userId: number) {
    return await this.categoryRepo.find({
      where: { userId },
      order: { name: 'ASC' },
    });
  }

  async findOne(userId: number, id: number) {
    const category = await this.categoryRepo.findOne({
      where: { id, userId },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async create(userId: number, dto: CreateNoteCategoryDTO) {
    const category = this.categoryRepo.create({
      userId,
      ...dto,
    });
    return await this.categoryRepo.save(category);
  }

  async update(userId: number, id: number, dto: CreateNoteCategoryDTO) {
    const category = await this.findOne(userId, id);
    category.name = dto.name;
    category.color = dto.color;
    return await this.categoryRepo.save(category);
  }

  async remove(userId: number, id: number) {
    const category = await this.findOne(userId, id);
    // Hard delete or soft? Usually categories are hard deleted or we check if used. 
    // For simplicity, hard delete. If used, set foreign key to null?
    // Entity has no cascade options set, so this might fail if used.
    // User requested simple crud. Let's try delete.
    await this.categoryRepo.remove(category);
    return { result: true };
  }
}
