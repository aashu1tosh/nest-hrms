import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { typeOrmConfigAsync } from './config/orm.config';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync as TypeOrmModuleAsyncOptions),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
