import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { IsNotBlank } from "src/common/dto/is-not-blank.dto";
import { CreateAuthDTO } from 'src/modules/auth/dto/auth.dto';

export class CreateCompanyAdminDTO {
    @IsNotBlank()
    @IsString()
    firstName: string;

    @IsOptional()
    @IsString()
    middleName: string;

    @IsNotBlank()
    @IsString()
    lastName: string;

    @IsUUID()
    @IsNotBlank()
    companyId: string;

    @ValidateNested()
    @Type(() => CreateAuthDTO)
    auth: CreateAuthDTO;
}

export class UpdateCompanyAdminDTO extends PartialType(CreateCompanyAdminDTO) { }