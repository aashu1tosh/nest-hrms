import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiMessage } from 'src/common/decorator/api-response.decorator';
import { Authentication } from 'src/common/decorator/authentication.decorator';
import { Authorization } from 'src/common/decorator/authorization.decorator';
import { Role } from 'src/constant/enum';
import { Message } from 'src/constant/message';
import { UpdateAdminDTO } from './dto/admin.dto';
import { AdminService } from './service/admin.service';

@Controller('admin')
@Authentication()
@Authorization([Role.SUDO_ADMIN])
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
  ) { }

  @Patch(':id')
  @ApiMessage(Message.updated)
  async update(
    @Param('id') id: string,
    @Body() updateAdminDTO: UpdateAdminDTO) {
    await this.adminService.update(id, updateAdminDTO);
  }

  @Get(':id')
  @ApiMessage(Message.fetched)
  async getById(@Param('id') id: string) {
    const admin = await this.adminService.getById(id);
    return {
      data: admin,
    };
  }

  @Get()
  @ApiMessage(Message.fetched)
  async getAll(
    @Param('page') page: number,
    @Param('perPage') perPage: number,
    @Param('search') search?: string,
  ) {
    const [admins, count] = await this.adminService.getAll({
      page,
      perPage,
      search,
    });
    return {
      data: admins,
      pagination: {
        total: count,
        page,
        perPage,
      },
    };
  }
}
