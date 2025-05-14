import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IsNotBlank } from 'src/common/dto/is-not-blank.dto';
import { EmployeeStatus } from 'src/constant/enum';
import { CreateAuthDTO } from 'src/modules/auth/dto/auth.dto';

export class CreateEmployeeDTO {
  @IsNotEmpty()
  @IsNotBlank()
  firstName: string;

  @IsOptional()
  @IsString()
  middleName: string;

  @IsNotEmpty()
  @IsNotBlank()
  lastName: string;

  @IsNotEmpty()
  @IsNotBlank()
  phone: string;

  @IsNotEmpty()
  @IsEnum(EmployeeStatus)
  status: EmployeeStatus;

  @ValidateNested()
  @Type(() => CreateAuthDTO)
  auth: CreateAuthDTO;
}

export class UpdateEmployeeDTO extends PartialType(
  OmitType(CreateEmployeeDTO, ['auth'] as const),
) {}
