import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In, Between, FindOptionsWhere } from 'typeorm';
import { NoteDTO } from './dto/note.dto';
import { NoteEntity } from './note.entity';
import { GetNotesDTO } from './dto/get-notes.dto';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(NoteEntity)
    private readonly noteRepo: Repository<NoteEntity>,
  ) {}

  async create(userId: number, dto: NoteDTO) {
    const { title, content, categoryId } = dto;
    const note = this.noteRepo.create({
      userId,
      title,
      content,
      categoryId: categoryId ?? undefined,
    });
    return await this.noteRepo.save(note);
  }

  async findAll(userId: number, query?: GetNotesDTO) {
    console.log(query)
    const baseWhere: FindOptionsWhere<NoteEntity> = {
      userId,
    };

    if (query?.categoryIds) {
      const ids = query.categoryIds.split(',').map(Number);
      if (ids.length > 0) {
        baseWhere.categoryId = In(ids);
      }
    }

    if (query?.startDate && query?.endDate) {
      baseWhere.createdAt = Between(
        new Date(query.startDate),
        new Date(`${query.endDate} 23:59:59`),
      );
    }

    let where:
      | FindOptionsWhere<NoteEntity>
      | FindOptionsWhere<NoteEntity>[] = baseWhere;

    if (query?.search) {
      const searchLike = Like(`%${query.search}%`);
      where = [
        { ...baseWhere, title: searchLike },
        { ...baseWhere, content: searchLike },
      ];
    }

    console.log(where);

    const [list, count] = await this.noteRepo.findAndCount({
      where,
      relations: ['category'],
      order: { createdAt: 'DESC' },
    });

    return { list, count };
  }

  async findOne(userId: number, id: number) {
    const note = await this.noteRepo.findOne({
      where: { id, userId },
      relations: ['category']
    });
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return note;
  }

  async update(userId: number, id: number, body: NoteDTO) {
    const note = await this.findOne(userId, id);
    const { title, content, categoryId } = body;
    
    // Update fields if they exist in body
    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (categoryId !== undefined) note.categoryId = categoryId;

    return await this.noteRepo.save(note);
  }

  async remove(userId: number, id: number) {
    const note = await this.findOne(userId, id);
    // Soft delete
    await this.noteRepo.softRemove(note);
    return { result: true };
  }
}
