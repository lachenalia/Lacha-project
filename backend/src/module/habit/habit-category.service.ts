import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HabitCategoryEntity } from './habit-category.entity';

@Injectable()
export class HabitCategoryService {
  constructor(
    @InjectRepository(HabitCategoryEntity)
    private readonly habitCategoryRepository: Repository<HabitCategoryEntity>,
  ) {}

  async findAll(userId: number): Promise<HabitCategoryEntity[]> {
    return await this.habitCategoryRepository.find({
      where: { userId },
      order: { id: 'ASC' },
    });
  }

  async create(userId: number, name: string, icon: string): Promise<HabitCategoryEntity> {
    const category = this.habitCategoryRepository.create({
      userId,
      name,
      icon,
    });
    return await this.habitCategoryRepository.save(category);
  }

  async update(userId: number, id: number, name: string, icon: string): Promise<HabitCategoryEntity> {
    const category = await this.habitCategoryRepository.findOne({
      where: { id, userId },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    category.name = name;
    category.icon = icon;
    return await this.habitCategoryRepository.save(category);
  }

  async remove(userId: number, id: number): Promise<void> {
    const category = await this.habitCategoryRepository.findOne({
      where: { id, userId },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    await this.habitCategoryRepository.remove(category);
  }
}
