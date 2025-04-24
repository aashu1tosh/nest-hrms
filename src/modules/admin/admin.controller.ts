import { Body, Controller, Post } from '@nestjs/common';
import { CreateAdminDTO } from './dto/admin.dto';

@Controller('admin')
export class AdminController {
  constructor() {}
  @Post('/register')
  create(@Body() data: CreateAdminDTO) {
    console.log(data);
    // await this.
  }
}
