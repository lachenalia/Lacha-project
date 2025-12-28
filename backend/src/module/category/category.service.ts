import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from './category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async findAll(userId: number): Promise<CategoryEntity[]> {
    return await this.categoryRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async create(userId: number, name: string, color: string, icon?: string): Promise<CategoryEntity> {
    const category = this.categoryRepository.create({
      userId,
      name,
      color,
      icon,
    });
    return await this.categoryRepository.save(category);
  }

  async update(userId: number, id: number, name: string, color: string, icon?: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: { id, userId },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    category.name = name;
    category.color = color;
    if (icon !== undefined) {
      category.icon = icon;
    }
    return await this.categoryRepository.save(category);
  }

  async remove(userId: number, id: number): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: { id, userId },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    await this.categoryRepository.remove(category);
  }
}
