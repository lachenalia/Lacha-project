import { Injectable } from '@nestjs/common';
import { createHash, timingSafeEqual } from 'crypto';
import { UsersService } from '../users/users.service';
import { LoginRequestDTO, LoginResponseDTO } from './dto/login.dto';
import { SignUpDTO } from './dto/signup.dto';
import { UserEntity } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}
  async login(loginData: LoginRequestDTO): Promise<LoginResponseDTO> {
    const user = await this.usersService.getUser(loginData.email);
    if (!user) {
      return { loginResult: false, failCode: 404 };
    }

    const passwordHash = this.#passwordHash(loginData.password);

    if (
      user.passwordHash.length !== passwordHash.length ||
      !timingSafeEqual(
        Buffer.from(user.passwordHash),
        Buffer.from(passwordHash),
      )
    ) {
      return { loginResult: false, failCode: 401 };
    }

    await this.usersService.updateLastLoginAt(user.id);

    return {
      loginResult: true,
      userInfo: {
        email: user.email,
        name: user.name,
      },
    };
  }

  async signUp(dto: SignUpDTO) {
    const isUniqueEmail = await this.checkEmail(dto.email);
    if (!isUniqueEmail) throw Error('Email 중복이에요');
    const newUser = new UserEntity();
    newUser.email = dto.email;
    newUser.passwordHash = this.#passwordHash(dto.password);
    newUser.name = dto.name ?? dto.email.split('@')[0];

    await this.usersService.createUser(newUser);
  }

  async checkEmail(email: string) {
    const user = await this.usersService.getUser(email);
    return { available: !user };
  }

  #passwordHash(password: string) {
    return createHash('sha384').update(password, 'utf8').digest('hex');
  }
}
