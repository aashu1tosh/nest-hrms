import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CompanyModule } from '../company/company.module';
import { CompanyAdminController } from './company-admin.controller';
import { CompanyAdminService } from './service/company-admin.service';

@Module({
  imports: [AuthModule, CompanyModule],
  controllers: [CompanyAdminController],
  providers: [CompanyAdminService]
})
export class CompanyAdminModule { }
