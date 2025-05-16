import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Products } from './models';
import { JwtService } from '@nestjs/jwt';
import { JwtHelper } from 'src/helpers';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { FsHelper } from 'src/helpers/fs.helper';

@Module({
  imports: [
    SequelizeModule.forFeature([Products]),
  ],
  controllers:[ProductController],
  providers:[ProductService,JwtHelper,JwtService,FsHelper]
})
export class ProductModule {}