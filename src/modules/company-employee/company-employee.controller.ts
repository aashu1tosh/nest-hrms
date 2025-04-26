import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { Authentication } from 'src/common/decorator/authentication.decorator';
import { Authorization } from 'src/common/decorator/authorization.decorator';
import { Role } from 'src/constant/enum';
import { Message } from 'src/constant/message';
import { successResponse } from 'src/helper/success-response';
import { CreateEmployeeDTO } from './dto/company-employee.dto';
import { CompanyEmployeeService } from './service/company-employee.service';

@Controller('company-employee')
@Authentication()
@Authorization([Role.COMPANY_SUPER_ADMIN, Role.COMPANY_ADMIN])
export class CompanyEmployeeController {

    constructor(
        private companyEmployeeService: CompanyEmployeeService
    ) { }

    @Post()
    async create(@Body() data: CreateEmployeeDTO) {
        await this.companyEmployeeService.create({ data });
        return successResponse(Message.created);
    }

    @Get()
    async getAll(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('perPage', new DefaultValuePipe(10), ParseIntPipe) perPage: number,
        @Query('search') search?: string,) {
        const response = await this.companyEmployeeService.getAll({
            page,
            perPage,
            search
        });
        return successResponse(Message.fetched, {
            data: response[0],
            pagination: {
                page,
                total: response[1],
                perPage
            }
        });
    }

    @Get(':id')
    async getById(@Param('id') id: string) {
        const response = await this.companyEmployeeService.getById(id);
        return successResponse(Message.fetched, response);
    }
}
