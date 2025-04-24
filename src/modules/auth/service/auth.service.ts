import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/constant/enum';
import { Message } from 'src/constant/message';
import { AdminService } from 'src/modules/admin/service/admin.service';
import { DataSource, Repository } from 'typeorm';
import { CreateAuthDTO } from '../dto/auth.dto';
import { Auth } from '../entity/auth.entity';
import { HashingService } from './hashing/hashing.service';

@Injectable()
export class AuthService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Auth) private authRepo: Repository<Auth>,
    private adminService: AdminService,
    private hashingService: HashingService,
  ) { }

  async create({ data }: { data: CreateAuthDTO }) {
    try {
      const check = await this.authRepo
        .createQueryBuilder('auth')
        .where('auth.email = :email', { email: data.email })
        .getCount();

      if (check) throw new ForbiddenException(`${data.email} already in use`);

      const checkPhone = await this.authRepo
        .createQueryBuilder('auth')
        .where('auth.phone = :phone', { phone: data.phone })
        .getCount();

      if (checkPhone)
        throw new ForbiddenException(`${data.phone} already in use`);

      await this.dataSource.transaction(async (manager) => {
        const admin = await this.adminService.create(
          { data: data.admin },
          manager,
        );

        const auth = new Auth();
        auth.email = data.email;
        auth.role = (data.role as Role) ?? Role.ADMIN;
        auth.password = await this.hashingService.hash(data.password);
        auth.admin = admin;
        await manager.save(auth);
        return auth;
      });

      return Message.created;
    } catch (err) {
      console.log(err, 'error coming');
      throw err;
    }
  }


  async checkEmail(email: string) {
    const check = await this.authRepo
      .createQueryBuilder('auth')
      .where('auth.email = :email', { email })
      .getCount();

    return check;
  }

  async checkPhone(phone: string) {
    const check = await this.authRepo
      .createQueryBuilder('auth')
      .where('auth.phone = :phone', { phone })
      .getCount();

    return check;
  }
}
