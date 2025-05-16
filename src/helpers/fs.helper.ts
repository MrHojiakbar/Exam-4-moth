import { Injectable } from "@nestjs/common";
import { join } from "node:path";
import * as fs from "node:fs";
import * as fsPromise from "node:fs/promises";

@Injectable()
export class FsHelper {
    async UploadFiles(files: Express.Multer.File[]) {
        const fileFolder = join(process.cwd(), 'uploads')
        if (!fs.existsSync(fileFolder)) {
            fs.mkdirSync(fileFolder, { recursive: true })
        }
        let newFiles: string[] = []
        for (let file of files) {
            let fileName = `${Date.now()}-image.${file.originalname.split(".")[1]}`
            await fsPromise.writeFile(join(fileFolder, fileName), file.buffer)
            newFiles.push(fileName)
        }

        return {
            message: 'success',
            fileUrl: newFiles,
        }
    }

    async UpdateFiles(files: Express.Multer.File[], filesUrl: string[]) {
        const fileFolder = join(process.cwd(), 'uploads')
        if (!fs.existsSync(fileFolder)) {
            fs.mkdirSync(fileFolder, { recursive: true })
        }
        if (filesUrl) {
            for (let fileUrl of filesUrl) {
                const fileName = join(process.cwd(), 'uploads', fileUrl)
                fs.unlink(fileName, (err) => {
                    if (err) {
                        console.log(err);
                    }
                })
            }
        }
        let newFiles: string[] = []
        for (let file of files) {
            let fileName = `${Date.now()}-image.${file.originalname.split(".")[1]}`
            await fsPromise.writeFile(join(fileFolder, fileName), file.buffer)
            newFiles.push(fileName)
        }
        return {
            message: 'success',
            fileUrl: newFiles,
        }
    }
    async UpdateFile(file: Express.Multer.File, fileUrl: string) {
        const fileFolder = join(process.cwd(), 'uploads')
        if (!fs.existsSync(fileFolder)) {
            fs.mkdirSync(fileFolder, { recursive: true })
        }
        const delFileName = join(process.cwd(), 'uploads', fileUrl)
        fs.unlink(delFileName, (err) => {
            if (err) {
                console.log(err);
            }
        })
        let fileName = `${Date.now()}-image.${file.originalname.split(".")[1]}`
        await fsPromise.writeFile(join(fileFolder, fileName), file.buffer)

        return {
            message: 'success',
            fileUrl: fileName,
        }
    }
    async DeleteFiles(filesUrl: string[]) {
        if (filesUrl === null) {
            return
        }
        for (let fileUrl of filesUrl) {
            const fileName = join(process.cwd(), 'uploads', fileUrl)
            fs.unlink(fileName, (err) => {
                if (err) {
                    console.log(err);
                }
            })
        }
    }
    async DeleteFile(fileUrl: string) {
        if (fileUrl === null) {
            return
        }
        const fileName = join(process.cwd(), 'uploads', fileUrl)
        fs.unlink(fileName, (err) => {
            if (err) {
                console.log(err);
            }
        })
    }
}