import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Role } from 'src/constant/enum';
import { CreateAdminDTO } from 'src/modules/admin/dto/admin.dto';

export class CreateAuthDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsNotEmpty()
  @IsEnum(Role)
  role?: Role;

  @ValidateNested()
  @Type(() => CreateAdminDTO)
  admin: CreateAdminDTO;
}
