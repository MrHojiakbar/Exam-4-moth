import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtHelper } from 'src/helpers';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
  ],
  controllers:[AuthController],
  providers:[AuthService,JwtHelper,JwtService]
})
export class UserModule {}