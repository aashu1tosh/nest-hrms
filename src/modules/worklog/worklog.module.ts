import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { CompanyEmployeeModule } from '../company-employee/company-employee.module';
import { Worklog } from './entity/worklog.entity';
import { WorklogService } from './service/worklog.service';
import { WorklogController } from './worklog.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Worklog]),
    AuthModule,
    CompanyEmployeeModule,
  ],
  controllers: [WorklogController],
  providers: [WorklogService],
})
export class WorklogModule {}
