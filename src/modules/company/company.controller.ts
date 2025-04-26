import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { Authentication } from 'src/common/decorator/authentication.decorator';
import { Authorization } from 'src/common/decorator/authorization.decorator';
import { Role } from 'src/constant/enum';
import { Message } from 'src/constant/message';
import { successResponse } from 'src/helper/success-response';
import { CreateCompanyDTO, UpdateCompanyDTO } from './dto/company.dto';
import { CompanyService } from './service/company.service';

@Controller('company')
@Authentication()
@Authorization([Role.SUDO_ADMIN, Role.ADMIN])
export class CompanyController {

    constructor(
        private companyService: CompanyService
    ) { }


    @Post()
    async create(@Body() data: CreateCompanyDTO) {
        await this.companyService.create(data);
        return successResponse(Message.created);
    }

    @Get()
    async getAll(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('perPage', new DefaultValuePipe(10), ParseIntPipe) perPage: number,
        @Query('search') search?: string,) {
        const response = await this.companyService.getAll({
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
        const response = await this.companyService.getById(id);
        return successResponse(Message.fetched, response);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() data: UpdateCompanyDTO) {
        await this.companyService.update(id, data);
        return successResponse(Message.updated);
    }

}