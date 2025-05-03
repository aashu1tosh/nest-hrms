import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsNotBlank } from 'src/common/dto/is-not-blank.dto';

export class CreateAdminDTO {
  @ApiProperty({ example: 'First Name', description: 'First name of the user' })
  @IsNotEmpty()
  @IsNotBlank()
  firstName: string;

  @ApiProperty({ example: 'Middle Name', description: 'Middle name of the user' })
  @IsOptional()
  @IsString()
  middleName: string;

  @ApiProperty({ example: 'Last Name', description: 'Last name of the user' })
  @IsNotEmpty()
  @IsNotBlank()
  lastName: string;
}

export class UpdateAdminDTO extends CreateAdminDTO { }
