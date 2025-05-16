import { ArgumentMetadata, ConflictException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class CheckFileType implements PipeTransform {
    validMimeTypes: string[];
    constructor(...mimeTypes) {
        this.validMimeTypes = mimeTypes
    }

    transform(value: any, metadata: ArgumentMetadata) {
        for (let file of value) {
            if (!this.validMimeTypes.includes(`.${file.mimetype.split("/")[1]}`)) {
                throw new ConflictException('file type not true valid types ' + this.validMimeTypes.join(","))
            }
        }
        return value
    }
}