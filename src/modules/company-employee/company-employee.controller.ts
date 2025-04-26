import { BadRequestException, Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { Authentication } from 'src/common/decorator/authentication.decorator';
import { Authorization } from 'src/common/decorator/authorization.decorator';
import { User } from 'src/common/decorator/user.decorator';
import { Role } from 'src/constant/enum';
import { Message } from 'src/constant/message';
import { successResponse } from 'src/helper/success-response';
import { CreateEmployeeDTO, UpdateEmployeeDTO } from './dto/company-employee.dto';
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
        @User('companyId') companyId: string,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('perPage', new DefaultValuePipe(10), ParseIntPipe) perPage: number,
        @Query('search') search?: string,) {
        const response = await this.companyEmployeeService.getAll({
            page,
            perPage,
            search,
            companyId
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
    async getById(@Param('id') id: string, @User('companyId') companyId: string) {
        if (!companyId) throw new BadRequestException('Company is Required')
        const response = await this.companyEmployeeService.getById({ id, companyId });
        return successResponse(Message.fetched, response);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() data: UpdateEmployeeDTO, @User('companyId') companyId: string) {
        if (!companyId) throw new BadRequestException('Company is Required')
        await this.companyEmployeeService.update({ id, data, companyId });
        return successResponse(Message.updated);

    }

    @Delete(':id')
    async delete(@Param('id') id: string, @User('companyId') companyId: string) {
        if (!companyId) throw new BadRequestException('Company is Required')
        await this.companyEmployeeService.delete({ id, companyId });
        return successResponse(Message.deleted);
    }
}
