import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from './common/guard/authentication.guard';
import { AuthorizationGuard } from './common/guard/authorization.guard';
import { UserAgentGuard } from './common/guard/userAgent.guard';
import { typeOrmConfigAsync } from './config/orm.config';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    AuthModule,
    AdminModule,
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
  ],
})
export class AppModule { }
