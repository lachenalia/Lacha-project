import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginRequestDTO } from './dto/login.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginData: LoginRequestDTO) {
    return await this.authService.login(loginData.username, loginData.password);
  }

  @Post('logout')
  @HttpCode(204)
  async logout() {
    return true;
  }
}
