import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsNotBlank } from 'src/common/dto/isNotBlank.dto';

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
}
