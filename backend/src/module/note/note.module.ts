import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { NoteEntity } from './note.entity';
import { CategoryEntity } from '../category/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NoteEntity, CategoryEntity])],
  controllers: [NoteController],
  providers: [NoteService],
})
export class NoteModule {}
