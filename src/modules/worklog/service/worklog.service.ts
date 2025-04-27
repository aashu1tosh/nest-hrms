import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/constant/enum';
import { Message } from 'src/constant/message';
import { IJwtPayload } from 'src/modules/auth/interface/auth.interface';
import { CompanyEmployeeService } from 'src/modules/company-employee/service/company-employee.service';
import { Repository } from 'typeorm';
import { CreateWorklogDTO, UpdateWorklogDTO } from '../dto/worklog.dto';
import { Worklog } from '../entity/worklog.entity';

@Injectable()
export class WorklogService {
  constructor(
    @InjectRepository(Worklog) private worklogRepo: Repository<Worklog>,
    private companyEmployeeService: CompanyEmployeeService,
  ) {}

  async create({
    data,
    user,
  }: {
    data: CreateWorklogDTO;
    user: IJwtPayload;
  }): Promise<string> {
    const worklog = new Worklog();
    worklog.tasksCompleted = data.tasksCompleted;
    worklog.tasksInProgress = data.tasksInProgress;
    worklog.challengesFaced = data.challengesFaced;
    worklog.remarks = data.remarks;
    worklog.companyEmployee = await this.companyEmployeeService.checkEmployee({
      id: user.employeeId as string,
      companyId: user.companyId as string,
    });

    await worklog.save();
    return Message.created;
  }

  async getAll({
    page = 1,
    perPage = 10,
    search,
    user,
    employeeId,
  }: {
    page?: number;
    perPage?: number;
    search?: string;
    user: IJwtPayload;
    employeeId?: string;
  }): Promise<[Worklog[], number]> {
    const query = this.worklogRepo
      .createQueryBuilder('worklog')
      .select([
        'worklog.taskCompleted',
        'worklog.tasksInProgress',
        'worklog.challengesFaced',
        'worklog.plannedTasksForTomorrow',
      ])
      .leftJoin('worklog.companyEmployee', 'employee');

    if (
      [Role.COMPANY_ADMIN, Role.COMPANY_SUPER_ADMIN].includes(user.role as Role)
    ) {
      query
        .leftJoin('employee.company', 'company')
        .addSelect([
          'employee.id',
          'employee.firstName',
          'employee.middleName',
          'employee.lastName',
        ])
        .where('company.id = :companyId', { companyId: user.companyId });
      if (employeeId)
        query.andWhere('employee.id = :employeeId', { employeeId });
    } else {
      query.where('employee.id = :employeeId', { employeeId: user.employeeId });
    }

    if (search) {
      query.andWhere(
        `(worklog.taskCompleted LIKE :search 
        OR worklog.tasksInProgress LIKE :search 
        OR worklog.challengesFaced LIKE :search 
        OR worklog.plannedTasksForTomorrow LIKE :search)`,
        { search: `%${search}%` },
      );
    }

    const skip = (page - 1) * perPage;

    return await query.skip(skip).take(perPage).getManyAndCount();
  }

  async getById(id: number, user: IJwtPayload) {
    const query = this.worklogRepo
      .createQueryBuilder('worklog')
      .select([
        'worklog.id',
        'worklog.taskCompleted',
        'worklog.tasksInProgress',
        'worklog.challengesFaced',
        'worklog.plannedTasksForTomorrow',
        'worklog.createdAt',
      ])
      .leftJoin('worklog.companyEmployee', 'employee');

    if (
      [Role.COMPANY_ADMIN, Role.COMPANY_SUPER_ADMIN].includes(user.role as Role)
    ) {
      query
        .leftJoin('employee.company', 'company')
        .addSelect([
          'employee.id',
          'employee.firstName',
          'employee.middleName',
          'employee.lastName',
        ])
        .where('worklog.id = :id', { id })
        .andWhere('company.id = :companyId', { companyId: user.companyId });
    } else {
      query
        .where('worklog.id = :id', { id })
        .andWhere('employee.id = :employeeId', { employeeId: user.employeeId });
    }

    const worklog = await query.getOne();

    if (!worklog) throw new NotFoundException('Worklog not found');

    return worklog;
  }

  async update({
    id,
    data,
    user,
  }: {
    id: number;
    data: UpdateWorklogDTO;
    user: IJwtPayload;
  }) {
    const worklog = await this.getById(id, user);

    if (!worklog.editable)
      throw new BadRequestException('You can only edit worklogs created today');

    Object.assign(worklog, data);

    await this.worklogRepo.save(worklog);

    return worklog;
  }
}
