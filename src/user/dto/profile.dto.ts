import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { LocationInterface } from '../interfaces/location.interface';

export class ProfileDto {
  @IsString()
  @IsOptional()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly lastName: string;

  @IsString()
  @IsOptional()
  readonly companyName: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  readonly location: LocationInterface;
}
