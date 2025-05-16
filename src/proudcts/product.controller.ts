import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query, UploadedFiles, UseInterceptors, Version } from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProduct, GetAllUsersQueryDto, UpdateProduct } from "./dtos";
import { ApiBearerAuth, ApiConsumes } from "@nestjs/swagger";
import { Protected } from "src/decorators/protected.decorator";
import { Roles } from "src/decorators/role.decorator";
import { UserRoles } from "src/users/enums";
import { FilesInterceptor } from "@nestjs/platform-express";
import { CheckFileSizePipe } from "src/pipes/checkFileSize.pipe";
import { CheckFileType } from "src/pipes/checkFileMimeType.pipe";

@Controller({ path: "products", version: "1" })
@ApiBearerAuth()
export class ProductController {
    constructor(private service: ProductService) { }

    @Get()
    @Protected(true)
    @Roles([UserRoles.ADMIN])
    async getAll(@Query() queries: GetAllUsersQueryDto) {
        return this.service.getAll(queries)
    }

    @Get(":id")
    @Protected(true)
    @Roles([UserRoles.ADMIN])
    async getById(@Param("id", ParseIntPipe) id: number) {
        return this.service.getById(id)
    }

    @Post()
    @Protected(true)
    @Roles([UserRoles.ADMIN])
    @UseInterceptors(FilesInterceptor("images_url"))
    @ApiConsumes("multipart/form-data")
    async create(@Body() payload: CreateProduct, @UploadedFiles(new CheckFileSizePipe(5), new CheckFileType('.jpeg', '.png')) images_url: Express.Multer.File[]) {
        return this.service.create(payload, images_url)
    }

    @Patch()
    @Protected(true)
    @Roles([UserRoles.ADMIN])
    async update(@Body() payload: UpdateProduct, @Param("id", ParseIntPipe) id: number) {
        return this.service.update(payload, id)
    }

    @Patch()
    @Protected(true)
    @Roles([UserRoles.ADMIN])
    @UseInterceptors(FilesInterceptor("images"))
    @ApiConsumes("multipart/form-data")
    async updateFiles(@Param("id", ParseIntPipe) id: number, @UploadedFiles(new CheckFileSizePipe(5), new CheckFileType('.jpeg', '.png')) images: Express.Multer.File[]) {
        return this.service.updateFiles(images, id)
    }

    @Delete(":id")
    @Protected(true)
    @Roles([UserRoles.ADMIN])
    @HttpCode(204)
    async delete(@Param("id", ParseIntPipe) id: number) {
        return this.service.delete(id)
    }
}