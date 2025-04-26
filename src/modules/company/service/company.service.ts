import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCompanyDTO } from '../dto/company.dto';
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
}
