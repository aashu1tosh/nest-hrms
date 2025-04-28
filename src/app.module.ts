import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from './common/guard/authentication.guard';
import { AuthorizationGuard } from './common/guard/authorization.guard';
import { UserAgentGuard } from './common/guard/userAgent.guard';
import { TransformInterceptor } from './common/interceptor/transform.interceptor';
import { GlobalExceptionFilter } from './common/middleware/http-exception.middleware';
import { typeOrmConfigAsync } from './config/orm.config';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { CompanyAdminModule } from './modules/company-admin/company-admin.module';
import { CompanyEmployeeModule } from './modules/company-employee/company-employee.module';
import { CompanyModule } from './modules/company/company.module';
import { LoggerModule } from './modules/logger/logger.module';
import { WorklogModule } from './modules/worklog/worklog.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    AuthModule,
    AdminModule,
    CompanyModule,
    CompanyAdminModule,
    CompanyEmployeeModule,
    WorklogModule,
    LoggerModule
  ],
  controllers: [],
  providers: [
    AuthGuard,
    AuthorizationGuard,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: UserAgentGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule { }
