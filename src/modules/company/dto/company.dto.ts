import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from "class-validator";
import { IsNotBlank } from "src/common/dto/is-not-blank.dto";

export class CreateCompanyDTO {
    @IsNotBlank()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    phone: string;

    @IsNotBlank()
    @IsString()
    address: string;

    @IsOptional()
    @IsString()
    pan: string;
}

export class UpdateCompanyDTO extends PartialType(CreateCompanyDTO) { }