import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NoteDTO } from './dto/note.dto';
import { NoteEntity } from './note.entity';

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

  async findAll(userId: number) {
    return await this.noteRepo.find({
      where: { userId },
      relations: ['category'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(userId: number, id: number) {
    const note = await this.noteRepo.findOne({
      where: { id, userId },
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
