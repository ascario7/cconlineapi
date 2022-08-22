import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsString()
  @IsString()
  @IsNotEmpty()
  readonly confirmPassword: string;
}
