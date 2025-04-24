import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreateAdminDTO } from '../dto/admin.dto';
import { Admin } from '../entity/admin.entity';
@Injectable()
export class AdminService {
  constructor(@InjectRepository(Admin) private adminRepo: Repository<Admin>) {}

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
}
