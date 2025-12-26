import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { UserId } from 'src/app/user.decorator';
import { NoteDTO } from './dto/note.dto';
import { NoteService } from './note.service';
import { GetNotesDTO } from './dto/get-notes.dto';

@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  create(@UserId() userId: number, @Body() dto: NoteDTO) {
    return this.noteService.create(userId, dto);
  }

  @Get()
  findAll(@UserId() userId: number, @Query() query: GetNotesDTO) {
    return this.noteService.findAll(userId, query);
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
