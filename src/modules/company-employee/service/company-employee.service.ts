import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CompanyEmployee } from '../entity/company-employee.dto';

@Injectable()
export class CompanyEmployeeService {

    constructor(
        private dataSource: DataSource,
        @InjectRepository(CompanyEmployee) private companyEmployeeRepo: Repository<CompanyEmployee>,


    ) { }
}
