import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { CompanyModule } from '../company/company.module';
import { CompanyEmployeeController } from './company-employee.controller';
import { CompanyEmployee } from './entity/company-employee.entity';
import { CompanyEmployeeService } from './service/company-employee.service';

@Module({
  imports: [
    AuthModule,
    CompanyModule,
    TypeOrmModule.forFeature([CompanyEmployee]),
  ],
  controllers: [CompanyEmployeeController],
  providers: [CompanyEmployeeService],
  exports: [CompanyEmployeeService],
})
export class CompanyEmployeeModule {}
