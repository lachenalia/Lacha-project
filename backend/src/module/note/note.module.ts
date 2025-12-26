import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { NoteCategoryEntity } from './note-category.entity';
import { NoteEntity } from './note.entity';

import { NoteCategoryService } from './note-category.service';
import { NoteCategoryController } from './note-category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([NoteEntity, NoteCategoryEntity])],
  controllers: [NoteController, NoteCategoryController],
  providers: [NoteService, NoteCategoryService],
})
export class NoteModule {}
