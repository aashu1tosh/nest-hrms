import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CompanyEmployeeController } from './company-employee.controller';
import { CompanyEmployeeService } from './service/company-employee.service';

@Module({
  controllers: [CompanyEmployeeController],
  providers: [CompanyEmployeeService],
  imports: [AuthModule]
})
export class CompanyEmployeeModule { }
