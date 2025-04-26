import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { Message } from 'src/constant/message';
import { successResponse } from 'src/helper/success-response';
import { CreateCompanyAdminDTO } from './dto/company-admin.dto';
import { CompanyAdminService } from './service/company-admin.service';

@Controller('company-admin')
export class CompanyAdminController {

    constructor(
        private companyAdminService: CompanyAdminService
    ) { }

    @Post()
    async create(@Body() data: CreateCompanyAdminDTO) {
        await this.companyAdminService.create({ data });
        return successResponse(Message.created);
    }

    @Get()
    async getAll(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('perPage', new DefaultValuePipe(10), ParseIntPipe) perPage: number,
        @Query('search') search?: string,) {
        const response = await this.companyAdminService.getAll({
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
        const response = await this.companyAdminService.getById(id);
        return successResponse(Message.fetched, response);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() data: CreateCompanyAdminDTO) {
        await this.companyAdminService.update(id, data);
        return successResponse(Message.updated);
    }

}
