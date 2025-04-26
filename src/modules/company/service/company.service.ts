import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getNotFoundMessage } from 'src/constant/message';
import { Repository } from 'typeorm';
import { CreateCompanyDTO, UpdateCompanyDTO } from '../dto/company.dto';
import { Company } from '../entity/company.entity';

@Injectable()
export class CompanyService {

    constructor(
        @InjectRepository(Company) private companyRepo: Repository<Company>,
    ) { }

    async create(data: CreateCompanyDTO) {
        const company = new Company();
        company.name = data.name;
        company.phone = data.phone;
        company.address = data.address;
        company.pan = data.pan;
        return await this.companyRepo.save(company);
    }

    async getAll({
        page = 1,
        perPage = 10,
        search
    }: {
        page?: number;
        perPage?: number;
        search?: string;
    }): Promise<[Company[], number]> {
        const query = this.companyRepo.createQueryBuilder('company')
            .select(['company.id', 'company.name', 'company.phone', 'company.address', 'company.pan'])

        if (search) {
            query.where('company.name LIKE :search', { search: `%${search}%` })
                .orWhere('company.phone LIKE :search', { search: `%${search}%` })
                .orWhere('company.address LIKE :search', { search: `%${search}%` })
                .orWhere('company.pan LIKE :search', { search: `%${search}%` });
        }

        return await query.skip((page - 1) * perPage)
            .take(perPage)
            .getManyAndCount();
    }

    async getById(id: string): Promise<Company> {
        const data = await this.companyRepo.createQueryBuilder('company')
            .select(['company.id', 'company.name', 'company.phone', 'company.address', 'company.pan'])
            .where('company.id = :id', { id })
            .getOne();

        if (!data) throw new NotFoundException(getNotFoundMessage('Company'));
        return data;
    }

    async update(id: string, data: UpdateCompanyDTO) {
        const company = await this.getById(id);

        company.name = data.name ?? company.name;
        company.phone = data.phone ?? company.phone;
        company.address = data.address ?? company.address;
        company.pan = data.pan ?? company.pan;
        await this.companyRepo.save(company);
    }
}
