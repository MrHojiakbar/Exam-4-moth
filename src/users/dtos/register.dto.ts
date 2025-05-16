import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class RegisterUserDto {

    @ApiProperty({
        type:'string',
        required:true,
        example:'qwert'
    })
    @IsString()
    name: string;

    @ApiProperty({
        type: 'string',
        required: true,
        example: 'qwert@gmail.com',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        type: 'string',
        required: true,
        example: 'qwerty1234'
    })
    @IsString()
    password: string;

}
