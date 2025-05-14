import {
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
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ApiMessage } from 'src/common/decorator/api-response.decorator';
import { Authentication } from 'src/common/decorator/authentication.decorator';
import { Authorization } from 'src/common/decorator/authorization.decorator';
import { Role } from 'src/constant/enum';
import { Message } from 'src/constant/message';
import { CreateCompanyDTO, UpdateCompanyDTO } from './dto/company.dto';
import { CompanyService } from './service/company.service';

@Controller('company')
@ApiMessage('Company CRUD API')
@ApiBearerAuth()
@Authentication()
@Authorization([Role.SUDO_ADMIN, Role.ADMIN])
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @Post()
  @ApiMessage(Message.created)
  async create(@Body() data: CreateCompanyDTO) {
    await this.companyService.create(data);
  }

  @Get()
  @ApiMessage(Message.fetched)
  @ApiQuery({ name: 'page', type: Number, required: false, example: 1 }) // Define each query separately
  @ApiQuery({ name: 'perPage', type: Number, required: false, example: 10 })
  @ApiQuery({
    name: 'search',
    type: String,
    required: false,
    example: 'search_name',
  })
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(10), ParseIntPipe) perPage: number,
    @Query('search') search?: string,
  ) {
    const response = await this.companyService.getAll({
      page,
      perPage,
      search,
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
  @ApiMessage(Message.fetched)
  async getById(@Param('id') id: string) {
    const response = await this.companyService.getById(id);
    return response;
  }

  @Patch(':id')
  @ApiMessage(Message.updated)
  async update(@Param('id') id: string, @Body() data: UpdateCompanyDTO) {
    await this.companyService.update(id, data);
  }
}
