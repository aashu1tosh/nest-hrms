import { Body, Controller, Post } from '@nestjs/common';
import { CreateAuthDTO } from './dto/auth.dto';
import { AuthService } from './service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  async create(@Body() data: CreateAuthDTO) {
    console.log(data, 'check');
    await this.authService.create({ data });
  }
}
