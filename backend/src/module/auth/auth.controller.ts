import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginRequestDTO } from './dto/login.dto';
import { AuthService } from './auth.service';
import { CheckEmailDTO, SignUpDTO } from './dto/signup.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginData: LoginRequestDTO) {
    return await this.authService.login(loginData);
  }

  @Post('logout')
  @HttpCode(204)
  async logout() {
    return true;
  }

  @Post('signup')
  async signUp(@Body() dto: SignUpDTO) {
    return this.authService.signUp(dto);
  }

  @Post('check-email')
  @HttpCode(200)
  async checkEmail(@Body() dto: CheckEmailDTO) {
    return this.authService.checkEmail(dto.email);
  }
}
