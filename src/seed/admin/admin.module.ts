import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfigAsync } from 'src/config/orm.config';
import { AuthModule } from 'src/modules/auth/auth.module';
import { AdminSeederService } from './service/admin.service';


@Module({

  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    AuthModule
  ],
  providers: [AdminSeederService],


})
export class AdminSeederModule { }
