import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private readonly usersRepo: Repository<UserEntity>,
  ) {}

  async getUser(email: string): Promise<UserEntity | null> {
    const user = await this.usersRepo.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        passwordHash: true,
      },
    });
    if (!user) return null;

    return user;
  }

  async getUserById(id: number): Promise<Omit<UserEntity, 'passwordHash'> | null> {
    const user = await this.usersRepo.findOne({
      where: { id },
    });
    if (!user) return null;

    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async createUser(user: UserEntity) {
    await this.usersRepo.save(user);
  }

  async updateLastLoginAt(userId: number): Promise<void> {
    await this.usersRepo.update({ id: userId }, { lastLoginAt: new Date() });
  }
}
