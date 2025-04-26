import { IsOptional, IsString } from "class-validator";
import { IsNotBlank } from "src/common/dto/isNotBlank.dto";


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