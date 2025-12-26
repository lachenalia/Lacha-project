import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString } from "class-validator";

export class SignUpDTO {
    @ApiProperty({required: true,})
    @IsEmail()
    email!: string;

    @ApiProperty({required: true})
    @IsString()
    password!: string;

    @ApiProperty({required: false})
    @IsOptional()
    @IsString()
    name?: string;
}

export class CheckEmailDTO {
    @ApiProperty({required: true,})
    @IsEmail()
    email!: string;
}