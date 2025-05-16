

import { ApiProperty } from '@nestjs/swagger';
import { SortFields, SortOrder } from '../enums';
import { Transform } from 'class-transformer';
import {
    IsEnum,
    IsInt,
    IsOptional,
    IsPositive,
    IsArray,
} from 'class-validator';
import { BadRequestException } from '@nestjs/common';

const acceptedFields = [
    'id',
    'name',
    'price',
    'discount',
    'rating',
    'stock',
    'status',
    'userId',
    'createdAt',
    'updatedAt',
    'images_url',
];

export class GetAllUsersQueryDto {
    @ApiProperty({
        type: 'number',
        required: false,
        default: 1,
    })
    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsInt()
    @IsPositive()
    page?: number;

    @ApiProperty({
        type: 'number',
        required: false,
        default: 10,
    })
    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsInt()
    @IsPositive()
    limit?: number;

    @ApiProperty({
        type: 'string',
        enum: SortFields,
        required: false,
    })
    @IsOptional()
    @IsEnum(SortFields)
    sortField?: SortFields;

    @ApiProperty({
        type: 'string',
        enum: SortOrder,
        default: SortOrder.ASC,
        required: false,
    })
    @IsOptional()
    @IsEnum(SortOrder)
    sortOrder?: SortOrder;

    @ApiProperty({
        type: 'number',
        required: false,
        minimum: 0,
    })
    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsInt()
    @IsPositive()
    minPrice?: number;

    @ApiProperty({
        type: 'number',
        required: false,
        minimum: 0,
    })
    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsInt()
    @IsPositive()
    maxPrice?: number;

    @ApiProperty({
        type: 'string',
        required: false,
    })
    @IsOptional()
    @Transform(({ value }) => {
        if (!value?.length) return acceptedFields;
        else {
            console.log(value);

            const values: string[] = value.split(',');
            const isValid = values.every((el) => acceptedFields.includes(el));
            if (!isValid)
                throw new BadRequestException(`Xato ustun yuborildi: ${value}`);
            return values;
        }
    })
    @IsArray()
    fields?: string[];
}
