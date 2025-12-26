import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemoService } from './memo.service';
import { MemoController } from './memo.controller';
import { MemoEntity } from './memo.entity';
import { MemoCategoryEntity } from './memo-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MemoEntity, MemoCategoryEntity])],
  controllers: [MemoController],
  providers: [MemoService],
})
export class MemoModule {}
