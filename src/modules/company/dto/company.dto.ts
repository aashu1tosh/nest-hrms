// import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from "class-validator";
import { IsNotBlank } from "src/common/dto/is-not-blank.dto";

export class CreateCompanyDTO {
    @ApiProperty({ example: 'Company Name' })
    @IsNotBlank()
    @IsString()
    name: string;

    @ApiProperty({ example: 'Company Phone', required: false })
    @IsOptional()
    @IsString()
    phone: string;

    @ApiProperty({ example: 'Company address' })
    @IsNotBlank()
    @IsString()
    address: string;

    @ApiProperty({ example: 'Company PAN', required: false })
    @IsOptional()
    @IsString()
    pan: string;
}

export class UpdateCompanyDTO extends PartialType(CreateCompanyDTO) { }