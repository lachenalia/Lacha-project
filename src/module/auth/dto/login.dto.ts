import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { UserInfo } from 'src/common/types/user-info.type';

export class LoginRequestDTO {
  @ApiProperty({ required: true, type: 'string' })
  @IsString()
  username!: string;

  @ApiProperty({ required: true, type: 'string' })
  @IsString()
  password!: string;
}

export class LoginResponseDTO {
  loginResult!: boolean;
  failCode?: number;
  userInfo?: any;
}
