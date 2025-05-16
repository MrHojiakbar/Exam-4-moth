import { ConflictException, Injectable, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { FsHelper } from "src/helpers/fs.helper";
import { User } from "src/users/models";
import { CreateProduct, GetAllUsersQueryDto, UpdateProduct } from "./dtos";
import { col, fn, Op } from "sequelize";
import { Products } from "./models";
import * as fs from "node:fs";
import { join } from "node:path";

@Injectable()
export class ProductService implements OnModuleInit {
    constructor(@InjectModel(Products) private readonly productModel: typeof Products, private fs: FsHelper) { }

    async onModuleInit() {
        try {
            const seedProducts = JSON.parse(fs.readFileSync(join(process.cwd(), 'seeds', 'products.seed.json'), 'utf-8'))
            for(let product of seedProducts){
                await this.productModel.create(product)
            }
    
            return 'DEFAULT Products created'
        } catch (error) {
            console.log(error.message);
            console.log("DEFAULT Products created");
        }
    }

    async getAll(query: GetAllUsersQueryDto) {
        let filters: any = {}

        if (query.minPrice) {
            filters.price = {
                [Op.gte]: query.minPrice
            }
        }
        if (query.maxPrice) {
            filters.price = {
                ...filters?.price,
                [Op.lte]: query.maxPrice
            }
        }

        let { count, rows: users } = await this.productModel.findAndCountAll({
            limit: query.limit || 10,
            offset: ((query.page as any) - 1) * (query.limit as any) || 0,
            order: query.sortField
                ? [[query.sortField, query.sortOrder || 'ASC']] : undefined,
            where: { ...filters },
            attributes: query.fields
        })
        return {
            count: count,
            limit: query.limit || 10,
            page: query.page || 1,
            data: users,
        };
    }

    async getById(id: number) {
        const findProduct = await this.productModel.findByPk(id)
        if (!findProduct) {
            throw new ConflictException(`Product Not Found`)
        }
        return {
            message: "success",
            data: findProduct.toJSON()
        }
    }

    async create(payload: CreateProduct, images: Express.Multer.File[]) {

        const newImages = await this.fs.UploadFiles(images)
        console.log(newImages);


        payload.images_url = (newImages.fileUrl as any)

        const newProduct = await this.productModel.create((payload as any), {
            returning: true
        })

        return {
            message: "success",
            data: newProduct
        }
    }

    async update(payload: UpdateProduct, id: number) {
        await this.getById(id)
        const updateProduct = await this.productModel.update(
            {
                name: fn('COALESCE', payload.name, col('name')),
                description: fn('COALESCE', payload.description, col('description')),
                discount: fn('COALESCE', payload.discount, col('discount')),
                price: fn('COALESCE', payload.price, col('price')),
                rating: fn('COALESCE', payload.rating, col('rating')),
                stock: fn('COALESCE', payload.stock, col('stock')),
            },
            {
                where: { id },
                returning: true
            },
        )

        return {
            message: "success",
            data: updateProduct
        }
    }

    async updateFiles(images: Express.Multer.File[], id: number) {
        const foundProduct = await this.getById(id)
        const updateFiles = (await this.fs.UpdateFiles(images, foundProduct.data.images_url)).fileUrl

        const updateProductFiles = await this.productModel.update(
            {
                images_url: updateFiles
            },
            {
                where: { id },
                returning: true
            }
        )
        return {
            message: "success",
            data: updateProductFiles
        }
    }
    async delete(id: number) {

        const filesUrl = (await this.getById(id)).data?.images_url
        await this.fs.DeleteFiles(filesUrl)
        await this.productModel.destroy({
            where: { id }
        });
    }
}