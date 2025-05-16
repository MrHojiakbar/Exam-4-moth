import { ArgumentMetadata, ConflictException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class CheckFileSizePipe implements PipeTransform {
    oversize: number
    constructor(oversize: number) {
        this.oversize = oversize * 1024 * 1024
    }
    transform(value: any, metadata: ArgumentMetadata) {
        for (let file of value) {
            if (file.size > this.oversize) {
                throw new ConflictException(`File oversize is ${this.oversize} you file size is ${value.size}`)
            }
        }
        return value
    }
}