import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { CompanyModule } from '../company/company.module';
import { CompanyAdminController } from './company-admin.controller';
import { CompanyAdmin } from './entity/company-admin.entity';
import { CompanyAdminService } from './service/company-admin.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyAdmin]), AuthModule, CompanyModule
  ],
  controllers: [CompanyAdminController],
  providers: [CompanyAdminService]
})
export class CompanyAdminModule { }
