import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Role } from 'src/constant/enum';

export class CreateAuthDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @IsNotEmpty()
  @IsEnum(Role)
  role?: Role;

  @ValidateNested()
  @Type(() => CreateAuthDTO)
  auth: CreateAuthDTO;
}
