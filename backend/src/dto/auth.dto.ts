import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
