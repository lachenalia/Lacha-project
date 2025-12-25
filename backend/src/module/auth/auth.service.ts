import { Injectable } from '@nestjs/common';
import { createHash, timingSafeEqual } from 'crypto';
import { UsersService } from '../users/users.service';
import { LoginResponseDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}
  async login(email: string, password: string): Promise<LoginResponseDTO> {
    const user = await this.usersService.getUser(email);
    if (!user) {
      return { loginResult: false, failCode: 404 };
    }
    
    const passwordHash = createHash('sha384').update(password, 'utf8').digest('hex');

    if (
      user.passwordHash.length !== passwordHash.length ||
      !timingSafeEqual(Buffer.from(user.passwordHash), Buffer.from(passwordHash))
    ) {
      return { loginResult: false, failCode: 401 };
    }

    // TODO: 사용자 last login at 업데이트
    return { loginResult: true, userInfo: {
      email: user.email,
      name: user.name,
    } };
  }
}
