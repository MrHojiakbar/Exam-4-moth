import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, Max, Min ,IsOptional} from "class-validator";

export class UpdateProduct {
    @ApiProperty({
        type: 'string',
        required: true,
        example: 'banan',
    })
    @IsOptional()
    @IsString()
    name: string;

    @ApiProperty({
        type: 'number',
        required: true,
        example: 100,
    })
    @IsOptional()
    @IsNumber()
    price: number;

    @ApiProperty({
        type: 'string',
        required: true,
        example: 'banan sariq',
    })
    @IsOptional()
    @IsString()
    description: string;


    @ApiProperty({
        type: 'number',
        required: true,
        example: 50,
    })
    @IsOptional()
    @IsNumber()
    discount: number;


    @ApiProperty({
        type: 'number',
        required: true,
        example: 1
    })
    @Max(5)
    @Min(0)
    @IsOptional()
    @IsNumber()
    rating: number


    @ApiProperty({
        type: 'number',
        required: true,
        example: 1,
    })
    @IsNumber()
    @IsOptional()
    stock: number;

}