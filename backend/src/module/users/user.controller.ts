import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserId } from 'src/app/user.decorator';
import { UsersService } from './users.service';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Get('my')
  async getMyInfo(@UserId() userId: number) {
    return this.usersService.getUserById(userId);
  }
}
