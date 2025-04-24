import { Body, Controller, Post } from '@nestjs/common';
import { AdminCreateDTO } from './dto/admin.dto';

@Controller('admin')
export class AdminController {

    @Post('/register')
    create(@Body() data: AdminCreateDTO) {
        console.log(data)
    }
}
