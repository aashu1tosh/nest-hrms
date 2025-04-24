import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, MinLength } from 'class-validator';
import { Role } from 'src/constant/enum';

export class CreateAuthDTO {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @MinLength(8)
    @IsNotEmpty()
    password: string;

    @IsOptional()
    @IsPhoneNumber()
    phoneNumber?: string;

    @IsNotEmpty()
    @IsEnum(Role)
    role?: Role;
}
