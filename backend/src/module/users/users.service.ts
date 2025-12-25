import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  async getUser(email: string): Promise<User | null> {
    const user = await this.usersRepo.findOne({
      where: { email: email },
    });
    if (!user) return null;

    return user
  }
}
