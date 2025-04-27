import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiMessage } from 'src/common/decorator/api-response.decorator';
import { Authentication } from 'src/common/decorator/authentication.decorator';
import { Authorization } from 'src/common/decorator/authorization.decorator';
import { Role } from 'src/constant/enum';
import { Message } from 'src/constant/message';
import { successResponse } from 'src/helper/success-response';
import { CreateCompanyAdminDTO } from './dto/company-admin.dto';
import { CompanyAdminService } from './service/company-admin.service';

@Controller('company-admin')
@Authentication()
@Authorization([Role.SUDO_ADMIN, Role.ADMIN])
export class CompanyAdminController {

    constructor(
        private companyAdminService: CompanyAdminService
    ) { }

    @Post()
    @ApiMessage(Message.created)
    async create(@Body() data: CreateCompanyAdminDTO) {
        await this.companyAdminService.create({ data });
    }

    @Get()
    @ApiMessage(Message.fetched)
    async getAll(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('perPage', new DefaultValuePipe(10), ParseIntPipe) perPage: number,
        @Query('search') search?: string,) {
        const response = await this.companyAdminService.getAll({
            page,
            perPage,
            search
        });
        return {
            data: response[0],
            pagination: {
                page,
                total: response[1],
                perPage
            }
        };
    }

    @Get(':id')
    @ApiMessage(Message.fetched)
    async getById(@Param('id') id: string) {
        const response = await this.companyAdminService.getById(id);
        return successResponse(Message.fetched, response);
    }

    @Patch(':id')
    @ApiMessage(Message.updated)
    async update(@Param('id') id: string, @Body() data: CreateCompanyAdminDTO) {
        await this.companyAdminService.update(id, data);
        return successResponse(Message.updated);
    }

}
