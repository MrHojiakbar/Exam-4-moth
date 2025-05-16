import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber, IsNumberString, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateProduct {
    @ApiProperty({
        type: 'string',
        required: true,
        example: 'banan',
    })
    @IsString()
    name: string;

    @ApiProperty({
        type: 'number',
        required: true,
        example: 100,
    })
    @Transform(({ value }) => Number(value))
    @IsNumber()
    price: number;

    @ApiProperty({
        type: 'string',
        required: true,
        example: 'banan sariq',
    })
    @IsString()
    description: string;


    @ApiProperty({
        type: 'number',
        required: true,
        example: 50,
    })
    @Transform(({ value }) => Number(value))
    @IsNumber()
    discount: number;


    @ApiProperty({
        type: 'number',
        required: true,
        example: 1
    })
    @Transform(({ value }) => Number(value))
    @IsNumber()
    @Max(5)
    @Min(0)
    rating: number


    @ApiProperty({
        type: 'number',
        required: true,
        example: 1,
    })
    @Transform(({ value }) => Number(value))
    @IsNumber()
    stock: number;

    @ApiProperty({
        type: 'number',
        required: true,
        example: 1,
    })
    @Transform(({ value }) => Number(value))
    @IsNumber()
    userId: number;

    @ApiProperty({
        type:'string',
        format:'binary',
        required:true,
        isArray:true
    })
    @IsOptional()
    images_url:Express.Multer.File[]
}