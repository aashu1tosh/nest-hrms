import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/constant/enum';
import { Message } from 'src/constant/message';
import { AdminService } from 'src/modules/admin/service/admin.service';
import { CompanyAdmin } from 'src/modules/company-admin/entity/company-admin.entity';
import { CompanyEmployee } from 'src/modules/company-employee/entity/company-employee.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { CreateAuthAdminDTO, CreateAuthDTO, LoginDTO } from '../dto/auth.dto';
import { Auth } from '../entity/auth.entity';
import { AuthTokens, IJwtPayload } from '../interface/auth.interface';
import { HashingService } from './hashing/hashing.service';

@Injectable()
export class AuthService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Auth) private authRepo: Repository<Auth>,
    private adminService: AdminService,
    private hashingService: HashingService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  async create({ data }: { data: CreateAuthAdminDTO }) {

    if (data.role === Role.SUDO_ADMIN) throw new ForbiddenException(Message.notAuthorized);

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
      auth.role = data.role;
      auth.password = await this.hashingService.hash(data.password);
      auth.admin = admin;
      await manager.save(auth);
      return auth;
    });

    return Message.created;

  }

  async createAuth({ data, companyAdmin, companyEmployee }: { data: CreateAuthDTO, companyAdmin?: CompanyAdmin, companyEmployee?: CompanyEmployee }, manager: EntityManager) {

    if (data.role === Role.SUDO_ADMIN || data.role === Role.ADMIN) throw new ForbiddenException(Message.notAuthorized);

    const check = await this.authRepo
      .createQueryBuilder('auth')
      .where('auth.email = :email', { email: data.email })
      .getOne();

    if (check) throw new ForbiddenException(`${data.email} already in use`);

    const checkPhone = await this.authRepo
      .createQueryBuilder('auth')
      .where('auth.phone = :phone', { phone: data.phone })
      .getOne();

    if (checkPhone)
      throw new ForbiddenException(`${data.phone} already in use`);

    const auth = new Auth();
    auth.email = data.email;
    auth.role = data.role;
    auth.password = await this.hashingService.hash(data.password);

    if (companyAdmin) auth.companyAdmin = companyAdmin;
    if (companyEmployee) auth.companyEmployee = companyEmployee;

    return await manager.save(auth);
  }

  async login({ data }: { data: LoginDTO }): Promise<AuthTokens> {
    const check = await this.authRepo
      .createQueryBuilder('auth')
      .select(['auth.id', 'auth.email', 'auth.password', 'auth.role'])
      .where('auth.email = :email', { email: data.email })
      .getOne();

    if (!check) throw new ForbiddenException(Message.invalidCredentials);

    const isMatch = await this.hashingService.compare(
      data.password,
      check.password,
    );

    if (!isMatch) throw new ForbiddenException(Message.invalidCredentials);
    delete (check as Partial<typeof check>).password;

    const auth = await this.authRepo.createQueryBuilder('auth').select(['auth.id', 'auth.role'])
      .leftJoin('auth.companyAdmin', 'companyAdmin')
      .addSelect(['companyAdmin.id'])
      .leftJoin('auth.companyEmployee', 'companyEmployee')
      .addSelect(['companyEmployee.id'])
      .leftJoin('companyEmployee.company', 'companyFromEmployee')
      .addSelect(['companyFromEmployee.id'])
      .leftJoin('companyAdmin.company', 'companyFromAdmin')
      .addSelect(['companyFromAdmin.id'])
      .where('auth.id = :id', { id: check.id })
      .getOne()

    console.log("🚀 ~ AuthService ~ login ~ auth:", auth)

    const payload: IJwtPayload = {
      id: auth?.id,
      role: auth?.role,
      companyId: auth?.companyAdmin?.company?.id,
      employeeId: auth?.companyEmployee?.id
    };
    return this.generateAccessAndRefreshToken(payload);
  }

  generateAccessAndRefreshToken(
    payload: IJwtPayload,
  ): AuthTokens {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION'),
      secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION'),
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
    });
    return { accessToken, refreshToken };
  }

  verifyAccessToken(token: string): IJwtPayload {
    try {
      const payload = this.jwtService.verify<IJwtPayload>(token, {
        secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      });
      return payload;
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('TOKEN_EXPIRED');
      }
      throw new UnauthorizedException(Message.notAuthorized);
    }
  }

  refreshToken({ refreshToken }: { refreshToken: string }) {
    try {
      const payload = this.jwtService.verify<IJwtPayload>(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });

      if (!payload) throw new UnauthorizedException(Message.notAuthorized);

      return this.generateAccessAndRefreshToken({
        id: payload?.id,
        role: payload?.role,
        companyId: payload?.companyId,
        employeeId: payload?.employeeId
      });
    } catch {
      throw new UnauthorizedException(Message.tokenExpired);
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
