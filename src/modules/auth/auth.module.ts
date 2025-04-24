import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from '../admin/admin.module';
import { AuthController } from './auth.controller';
import { Auth } from './entity/auth.entity';
import { AuthService } from './service/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([Auth]), AdminModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
