import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/constant/enum';
import { Repository } from 'typeorm';
import { CreateAuthDTO } from '../dto/auth.dto';
import { Auth } from '../entity/auth.entity';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(Auth) private authRepo: Repository<Auth>) {}

  async create({ data }: { data: CreateAuthDTO }) {
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

    const auth = new Auth();
    auth.email = data.email;
    auth.role = (data.role as Role) ?? Role.ADMIN;
    auth.password = data.password;
    await auth.save();
  }
}
