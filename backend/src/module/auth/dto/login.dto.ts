import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginRequestDTO {
  @ApiProperty({ required: true, type: 'string' })
  @IsString()
  email!: string;

  @ApiProperty({ required: true, type: 'string' })
  @IsString()
  password!: string;
}

export class LoginResponseDTO {
  loginResult!: boolean;
  failCode?: number;
  userInfo?: any;
}
