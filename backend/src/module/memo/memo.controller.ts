import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { UserId } from 'src/app/user.decorator';
import { MemoService } from './memo.service';

@Controller('memo')
export class MemoController {
  constructor(private readonly memoService: MemoService) {}

  @Post()
  create(@UserId() userId: number, @Body() body: any) {
    return this.memoService.create(userId, body);
  }

  @Get()
  findAll(@UserId() userId: number) {
    return this.memoService.findAll(userId);
  }

  @Get(':id')
  findOne(@UserId() userId: number, @Param('id') id: string) {
    return this.memoService.findOne(userId, +id);
  }

  @Put(':id')
  update(@UserId() userId: number, @Param('id') id: string, @Body() body: any) {
    return this.memoService.update(userId, +id, body);
  }

  @Delete(':id')
  remove(@UserId() userId: number, @Param('id') id: string) {
    return this.memoService.remove(userId, +id);
  }
}
