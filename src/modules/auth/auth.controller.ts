import { Body, Controller, Post } from '@nestjs/common';
import { CreateAuthDTO } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  @Post('/register')
  create(@Body() data: CreateAuthDTO) {
    console.log(data);
  }
}
