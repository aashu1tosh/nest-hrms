import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from 'src/common/guard/authentication.guard';
import { AuthorizationGuard } from 'src/common/guard/authorization.guard';
import { AdminModule } from '../admin/admin.module';
import { AuthController } from './auth.controller';
import { Auth } from './entity/auth.entity';
import { AuthService } from './service/auth.service';
import { HashingService } from './service/hashing/hashing.service';

@Module({
  imports: [TypeOrmModule.forFeature([Auth]), forwardRef(() => AdminModule),
  JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: (cs: ConfigService) => ({
      secret: cs.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      signOptions: {
        expiresIn: cs.get<string>('JWT_ACCESS_TOKEN_EXPIRATION'),
        algorithm: 'HS256',
      },
    }),
    inject: [ConfigService],
  }),

  // Refresh token JWT module (opt)
  JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: (cs: ConfigService) => ({
      secret: cs.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      signOptions: {
        expiresIn: cs.get<string>('JWT_REFRESH_TOKEN_EXPIRATION'),
        algorithm: 'HS256',
      },
    }),
    inject: [ConfigService],
  }),
  ],
  controllers: [AuthController],
  providers: [AuthService, HashingService, AuthGuard, AuthorizationGuard],
  exports: [AuthService, JwtModule, AuthGuard, AuthorizationGuard],
})
export class AuthModule { }
