import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginResponseDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}
  async login(username: string, password: string): Promise<LoginResponseDTO> {
    const user = await this.usersService.getUser(username);
    if (!user) {
      return { loginResult: false, failCode: 404 };
    }
    if (user.password !== password) {
      return { loginResult: false, failCode: 401 };
    }
    delete user.password;
    return { loginResult: true, userInfo: user };
  }
}
