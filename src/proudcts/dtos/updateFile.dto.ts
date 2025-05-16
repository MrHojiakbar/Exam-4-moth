import { ApiProperty } from "@nestjs/swagger";
import { IsOptional} from "class-validator";

export class UpdateFileProduct {
    @ApiProperty({
        type:'string',
        format:'binary',
        required:true,
        isArray:true
    })
    @IsOptional()
    images_url:Express.Multer.File[]
}