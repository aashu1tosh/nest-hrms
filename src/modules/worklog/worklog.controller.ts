import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiMessage } from 'src/common/decorator/api-response.decorator';
import { Authentication } from 'src/common/decorator/authentication.decorator';
import { Authorization } from 'src/common/decorator/authorization.decorator';
import { User } from 'src/common/decorator/user.decorator';
import { Role } from 'src/constant/enum';
import { Message } from 'src/constant/message';
import { IJwtPayload } from '../auth/interface/auth.interface';
import { CreateWorklogDTO, UpdateWorklogDTO } from './dto/worklog.dto';
import { WorklogService } from './service/worklog.service';

@Controller('worklog')
@Authentication()
export class WorklogController {
  constructor(private worklogService: WorklogService) { }

  @Post()
  @Authorization([Role.COMPANY_EMPLOYEE])
  @ApiMessage(Message.created)
  async create(@Body() data: CreateWorklogDTO, @User() user: IJwtPayload) {
    if (!user.companyId) throw new BadRequestException('Company is Required');
    if (!user.employeeId) throw new BadRequestException('Employee is Required');

    await this.worklogService.create({ data, user });
  }

  @Get()
  @Authorization([
    Role.COMPANY_EMPLOYEE,
    Role.COMPANY_SUPER_ADMIN,
    Role.COMPANY_ADMIN,
  ])
  @ApiMessage(Message.fetched)
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(10), ParseIntPipe) perPage: number,
    @User() user: IJwtPayload,
    @Query('search') search?: string,
    @Query('employeeId') employeeId?: string,
  ) {
    const response = await this.worklogService.getAll({
      page,
      perPage,
      search,
      user,
      employeeId,
    });

    return {
      data: response[0],
      pagination: {
        page,
        total: response[1],
        perPage,
      },
    };
  }

  @Get(':id')
  @Authorization([
    Role.COMPANY_EMPLOYEE,
    Role.COMPANY_SUPER_ADMIN,
    Role.COMPANY_ADMIN,
  ])
  @ApiMessage(Message.fetched)
  async getById(@Param('id') id: number, @User() user: IJwtPayload) {
    const response = await this.worklogService.getById(id, user);
    return response;
  }

  @Patch(':id')
  @Authorization([Role.COMPANY_EMPLOYEE])
  @ApiMessage(Message.updated)
  async update(
    @Param('id') id: number,
    @Body() data: UpdateWorklogDTO,
    @User() user: IJwtPayload,
  ) {
    await this.worklogService.update({ id, data, user });
  }
}
