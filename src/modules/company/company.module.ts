import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { CompanyController } from './company.controller';
import { Company } from './entity/company.entity';
import { CompanyService } from './service/company.service';

@Module({
  imports: [TypeOrmModule.forFeature([Company]), AuthModule],
  controllers: [CompanyController],
  providers: [CompanyService]
})
export class CompanyModule { }
