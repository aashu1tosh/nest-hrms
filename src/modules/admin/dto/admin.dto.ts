import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IsNotBlank } from 'src/common/dto/isNotBlank.dto';
import { CreateAuthDTO } from 'src/modules/auth/dto/auth.dto';

export class CreateAdminDTO {
  @IsNotEmpty()
  @IsNotBlank()
  firstName: string;

  @IsOptional()
  @IsString()
  middleName: string;

  @IsNotEmpty()
  @IsNotBlank()
  lastName: string;

  @ValidateNested()
  @Type(() => CreateAuthDTO)
  auth: CreateAuthDTO;
}
