import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from '../admin/admin.module';
import { AuthController } from './auth.controller';
import { Auth } from './entity/auth.entity';
import { AuthService } from './service/auth.service';
import { HashingService } from './service/hashing/hashing.service';

@Module({
  imports: [TypeOrmModule.forFeature([Auth]), AdminModule],
  controllers: [AuthController],
  providers: [AuthService, HashingService],
})
export class AuthModule {}
