import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreateAdminDTO } from '../dto/admin.dto';
import { Admin } from '../entity/admin.entity';
@Injectable()
export class AdminService {
  constructor(@InjectRepository(Admin) private adminRepo: Repository<Admin>) { }

  async create(
    { data }: { data: CreateAdminDTO },
    entityManager?: EntityManager,
  ) {
    const admin = new Admin();
    admin.firstName = data.firstName;
    admin.middleName = data.middleName;
    admin.lastName = data.lastName;

    if (entityManager) return await entityManager.save(admin);
    return await this.adminRepo.save(admin);
  }

  async getAll({
    page,
    perPage,
    search,
  }: {
    page: number;
    perPage: number;
    search?: string;
  }) {
    const query = this.adminRepo.createQueryBuilder('admin')
      .select(['admin.id', 'admin.firstName', 'admin.middleName', 'admin.lastName'])
      .leftJoin('admin.auth', 'auth')
      .addSelect(['auth.id', 'auth.email', 'auth.role']);

    if (search) {
      query.where(
        '(LOWER(admin.firstName) LIKE LOWER(:search) OR LOWER(admin.lastName) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }
    query.skip((page - 1) * perPage).take(perPage);
    return await query.getManyAndCount();
  }
  async getById(id: string) {

    //convert this to query builder
    const admin = await this.adminRepo.createQueryBuilder('admin')
      .select(['admin.id', 'admin.firstName', 'admin.middleName', 'admin.lastName'])
      .leftJoin('admin.auth', 'auth')
      .addSelect(['auth.id', 'auth.email', 'auth.role'])
      .where('admin.id = :id', { id })
      .getOne();

    if (!admin) throw new NotFoundException('Admin not found');
    return admin;
  }


  async update(id: string, data: CreateAdminDTO) {

    const admin = await this.adminRepo.createQueryBuilder('admin')
      .select(['admin.id'])
      .where('admin.id = :id', { id })
      .getOne();

    if (!admin) throw new NotFoundException('Admin not found');

    admin.firstName = data.firstName;
    admin.middleName = data.middleName;
    admin.lastName = data.lastName;
    return await this.adminRepo.save(admin);
  }
}
