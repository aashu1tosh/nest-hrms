import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/constant/message';
import { AuthService } from 'src/modules/auth/service/auth.service';
import { CompanyService } from 'src/modules/company/service/company.service';
import { DataSource, Repository } from 'typeorm';
import {
  CreateEmployeeDTO,
  UpdateEmployeeDTO,
} from '../dto/company-employee.dto';
import { CompanyEmployee } from '../entity/company-employee.entity';

@Injectable()
export class CompanyEmployeeService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(CompanyEmployee)
    private companyEmployeeRepo: Repository<CompanyEmployee>,
    private authService: AuthService,
    private companyService: CompanyService,
  ) {}

  async create({
    data,
    companyId,
  }: {
    data: CreateEmployeeDTO;
    companyId: string;
  }) {
    if (!companyId) throw new BadRequestException('Company is Required');

    await this.dataSource.transaction(async (manager) => {
      const companyEmployee = new CompanyEmployee();
      companyEmployee.firstName = data.firstName;
      companyEmployee.middleName = data.middleName;
      companyEmployee.lastName = data.lastName;
      companyEmployee.phone = data.phone;
      companyEmployee.status = data.status;
      companyEmployee.company =
        await this.companyService.checkCompany(companyId);

      const employee = await manager.save(companyEmployee);

      await this.authService.createAuth(
        {
          data: data.auth,
          companyEmployee: employee,
        },
        manager,
      );
    });

    return Message.created;
  }

  async getAll({
    page = 1,
    perPage = 10,
    search,
    companyId,
  }: {
    page?: number;
    perPage?: number;
    search?: string;
    companyId?: string;
  }): Promise<[CompanyEmployee[], number]> {
    if (!companyId) throw new BadRequestException('Company is Required');
    const query = this.companyEmployeeRepo
      .createQueryBuilder('employee')
      .select([
        'employee.id',
        'employee.firstName',
        'employee.middleName',
        'employee.lastName',
        'employee.phone',
        'employee.status',
        'employee.createdAt',
      ])
      .leftJoin('employee.auth', 'auth')
      .addSelect(['auth.email', 'auth.phone'])
      .leftJoin('employee.company', 'company')
      .addSelect(['company.id']);

    if (search)
      query
        .where('employee.firstName LIKE :search', { search: `%${search}%` })
        .orWhere('employee.middleName LIKE :search', { search: `%${search}%` })
        .orWhere('employee.lastName LIKE :search', { search: `%${search}%` });

    return await query
      .skip((page - 1) * perPage)
      .where('company.id = :companyId', { companyId })
      .take(perPage)
      .orderBy('employee.createdAt', 'DESC')
      .getManyAndCount();
  }

  async getById({
    id,
    companyId,
  }: {
    id: string;
    companyId: string;
  }): Promise<CompanyEmployee> {
    if (!companyId) throw new BadRequestException('Company is Required');

    const data = await this.companyEmployeeRepo
      .createQueryBuilder('employee')
      .select([
        'employee.id',
        'employee.firstName',
        'employee.middleName',
        'employee.lastName',
        'employee.phone',
        'employee.status',
      ])
      .leftJoin('employee.auth', 'auth')
      .addSelect(['auth.email', 'auth.phone'])
      .leftJoin('employee.company', 'company')
      .addSelect(['company.id'])
      .where('employee.id = :id', { id })
      .andWhere('company.id = :companyId', { companyId })
      .getOne();

    if (!data) throw new BadRequestException(Message.notFound);

    return data;
  }

  async update({
    id,
    data,
    companyId,
  }: {
    id: string;
    data: UpdateEmployeeDTO;
    companyId?: string;
  }) {
    if (!companyId) throw new BadRequestException('Company is Required');
    const check = await this.getById({ id, companyId });

    check.firstName = data.firstName ?? check.firstName;
    check.middleName = data.middleName ?? check.middleName;
    check.lastName = data.lastName ?? check.lastName;
    check.phone = data.phone ?? check.phone;
    check.status = data.status ?? check.status;

    await check.save();
    return Message.updated;
  }

  async checkEmployee({
    id,
    companyId,
  }: {
    id: string;
    companyId: string;
  }): Promise<CompanyEmployee> {
    if (!companyId) throw new BadRequestException('Company is Required');
    const check = await this.companyEmployeeRepo
      .createQueryBuilder('employee')
      .select(['employee.id'])
      .where('employee.id = :id', { id })
      .getOne();

    if (!check) throw new NotFoundException(Message.notFound);

    return check;
  }

  async delete({ id, companyId }: { id: string; companyId: string }) {
    const check = await this.checkEmployee({ id, companyId });

    await this.companyEmployeeRepo.delete(check.id);
    return Message.deleted;
  }
}
