import { Module } from '@nestjs/common';
import { CompanyAdminController } from './company-admin.controller';

@Module({
  controllers: [CompanyAdminController]
})
export class CompanyAdminModule {}
