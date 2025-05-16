import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize';
import {ServeStaticModule} from '@nestjs/serve-static'
import { join } from 'node:path';
import { UserModule } from './users/user.module';
import { ProductModule } from './proudcts/product.module';
import { CheckAuthGuard } from './guards/checkAuth.guard';
import { APP_GUARD } from '@nestjs/core';
import { CheckRolesGuard } from './guards/checkRoles.guard';
import { JwtService } from '@nestjs/jwt';
import { JwtHelper } from './helpers';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }),
  SequelizeModule.forRoot({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: false,
    sync: {
      alter: true,
    },
    autoLoadModels: true,
  }),
  ServeStaticModule.forRoot({
    rootPath:join(process.cwd(),'uploads'),
    serveRoot:'/uploads'
  }),
  UserModule,
  ProductModule,
  ],
  providers:[
    {
      provide:APP_GUARD,
      useClass:CheckAuthGuard
    },
    {
      provide:APP_GUARD,
      useClass:CheckRolesGuard
    },
    JwtService,
    JwtHelper
  ]
})
export class AppModule { }
