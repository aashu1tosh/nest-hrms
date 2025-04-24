import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ServiceService } from './service/auth.service';
import { AuthService } from './service/auth.service';

@Module({
  controllers: [AuthController],
  providers: [ServiceService, AuthService]
})
export class AuthModule { }
