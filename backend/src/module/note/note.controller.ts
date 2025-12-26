import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { UserId } from 'src/app/user.decorator';
import { NoteDTO } from './dto/note.dto';
import { NoteService } from './note.service';

@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  create(@UserId() userId: number, @Body() dto: NoteDTO) {
    return this.noteService.create(userId, dto);
  }

  @Get()
  findAll(@UserId() userId: number) {
    return this.noteService.findAll(userId);
  }

  @Get(':id')
  findOne(@UserId() userId: number, @Param('id') id: string) {
    return this.noteService.findOne(userId, +id);
  }

  @Put(':id')
  update(@UserId() userId: number, @Param('id') id: string, @Body() body: NoteDTO) {
    return this.noteService.update(userId, +id, body);
  }

  @Delete(':id')
  remove(@UserId() userId: number, @Param('id') id: string) {
    return this.noteService.remove(userId, +id);
  }
}
