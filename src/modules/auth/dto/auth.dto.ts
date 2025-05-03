import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ example: 'example@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Password@123' })
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: '98xxxxxxxx' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'ADMIN' })
  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}

export class CreateAuthAdminDTO extends CreateAuthDTO {
  @ApiProperty({ type: () => CreateAdminDTO })
  @ValidateNested()
  @Type(() => CreateAdminDTO)
  admin: CreateAdminDTO;
}

export class LoginDTO {
  @ApiProperty({ example: 'john_doe@check.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password@123' })
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}