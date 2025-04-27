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
import { Authentication } from 'src/common/decorator/authentication.decorator';
import { Authorization } from 'src/common/decorator/authorization.decorator';
import { User } from 'src/common/decorator/user.decorator';
import { Role } from 'src/constant/enum';
import { Message } from 'src/constant/message';
import { successResponse } from 'src/helper/success-response';
import { IJwtPayload } from '../auth/interface/auth.interface';
import { CreateWorklogDTO, UpdateWorklogDTO } from './dto/worklog.dto';
import { WorklogService } from './service/worklog.service';

@Controller('worklog')
@Authentication()
export class WorklogController {
  constructor(private worklogService: WorklogService) {}

  @Post()
  @Authorization([Role.COMPANY_EMPLOYEE])
  async create(@Body() data: CreateWorklogDTO, @User() user: IJwtPayload) {
    if (!user.companyId) throw new BadRequestException('Company is Required');
    if (!user.employeeId) throw new BadRequestException('Employee is Required');

    await this.worklogService.create({ data, user });
    return successResponse(Message.created);
  }

  @Get()
  @Authorization([
    Role.COMPANY_EMPLOYEE,
    Role.COMPANY_SUPER_ADMIN,
    Role.COMPANY_ADMIN,
  ])
  async getAll(
    @User('companyId') companyId: string,
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

    return successResponse(Message.fetched, {
      data: response[0],
      pagination: {
        page,
        total: response[1],
        perPage,
      },
    });
  }

  @Get(':id')
  @Authorization([
    Role.COMPANY_EMPLOYEE,
    Role.COMPANY_SUPER_ADMIN,
    Role.COMPANY_ADMIN,
  ])
  async getById(@Param('id') id: number, @User() user: IJwtPayload) {
    const response = await this.worklogService.getById(id, user);
    return successResponse(Message.fetched, response);
  }

  @Patch(':id')
  @Authorization([Role.COMPANY_EMPLOYEE])
  async update(
    @Param('id') id: number,
    @Body() data: UpdateWorklogDTO,
    @User() user: IJwtPayload,
  ) {
    await this.worklogService.update({ id, data, user });
    return successResponse(Message.updated);
  }
}
