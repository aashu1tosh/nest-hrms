import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/constant/message';
import { AuthService } from 'src/modules/auth/service/auth.service';
import { CompanyService } from 'src/modules/company/service/company.service';
import { DataSource, Repository } from 'typeorm';
import { CreateCompanyAdminDTO } from '../dto/company-admin.dto';
import { CompanyAdmin } from '../entity/company-admin.entity';

@Injectable()
export class CompanyAdminService {
    constructor(
        @InjectRepository(CompanyAdmin) private companyAdminRepo: Repository<CompanyAdmin>,
        private dataSource: DataSource,
        private companyService: CompanyService,
        private authService: AuthService,
    ) { }

    async create({ data }: { data: CreateCompanyAdminDTO }) {
        await this.dataSource.transaction(async (manager) => {

            const companyAdmin = new CompanyAdmin();
            companyAdmin.firstName = data.firstName;
            companyAdmin.middleName = data.middleName;
            companyAdmin.lastName = data.lastName;
            companyAdmin.company = await this.companyService.checkCompany(data.companyId);

            const admin = await manager.save(companyAdmin);

            await this.authService.createAuth(
                {
                    data: data.auth,
                    companyAdmin: admin
                }
                , manager)
        }
        );
        return Message.created;
    }

    async getAll({
        page = 1,
        perPage = 10,
        search
    }: {
        page?: number;
        perPage?: number;
        search?: string;
    }): Promise<[CompanyAdmin[], number]> {
        const query = this.companyAdminRepo.createQueryBuilder('company_admin')
            .select(['company_admin.id', 'company_admin.firstName', 'company_admin.middleName', 'company_admin.lastName'])
            .leftJoinAndSelect('companyAdmin.company', 'company')
            .leftJoinAndSelect('companyAdmin.auth', 'auth')

        if (search) {
            query.where('companyAdmin.firstName LIKE :search', { search: `%${search}%` })
                .orWhere('companyAdmin.middleName LIKE :search', { search: `%${search}%` })
                .orWhere('companyAdmin.lastName LIKE :search', { search: `%${search}%` });
        }

        return await query.skip((page - 1) * perPage)
            .take(perPage)
            .getManyAndCount();
    }

    async getById(id: string): Promise<CompanyAdmin> {
        const data = await this.companyAdminRepo.createQueryBuilder('companyAdmin')
            .select(['companyAdmin.id', 'companyAdmin.first_name', 'companyAdmin.middle_name', 'companyAdmin.last_name'])
            .leftJoin('companyAdmin.company', 'company')
            .addSelect(['company.id', 'company.name'])
            .where('companyAdmin.id = :id', { id })
            .getOne();

        if (!data) throw new NotFoundException(`Company Admin with id ${id} not found`);

        return data;
    }

    async update(id: string, data: CreateCompanyAdminDTO) {
        const check = await this.getById(id)

        check.firstName = data.firstName ?? check.firstName;
        check.middleName = data.middleName ?? check.middleName;
        check.lastName = data.lastName ?? check.lastName;

        await check.save();
        return Message.updated;
    }
}
