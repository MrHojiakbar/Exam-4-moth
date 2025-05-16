import { InjectModel } from "@nestjs/sequelize";
import { ConflictException, Injectable, OnModuleInit } from "@nestjs/common";
import * as bcrypt from 'bcryptjs'
import { JwtService } from "@nestjs/jwt";
import { JwtHelper } from "src/helpers";
import { User } from "./models";
import { LoginUserDto, RegisterUserDto } from "./dtos";
import * as fs from 'node:fs'
import { join } from "node:path";

@Injectable()
export class AuthService implements OnModuleInit {
    constructor(@InjectModel(User) private userModel: typeof User, private jwtHelper: JwtHelper) { }

    async onModuleInit() {
        const seedUser: { name: string, email: string, password: string, role: string } = JSON.parse(fs.readFileSync(join(process.cwd(), 'seeds', 'user.seed.json'), 'utf-8'))
        const findAdmin = await this.userModel.findOne({ where: { email: seedUser.email } })
        if (findAdmin) {
            console.log("ADMIN CREATED 😈");
            return 'Default Admin Created'
        }
        const passwordHash=bcrypt.hashSync(seedUser.password,8)
        
        await this.userModel.create({...seedUser,password:passwordHash})
        console.log("ADMIN CREATED 😈");
        return 'Default Admin Created'
    }

    async register(payload: RegisterUserDto) {
        await this.#_checkExistingUserByEmail(payload.email)
        
        
        const passwordHash = bcrypt.hashSync(payload.password, 8)
        
        const user = (await this.userModel.create({ email: payload.email, name: payload.name, password: passwordHash })).toJSON()
        
        const accessToken = this.jwtHelper.generateToken({ id: user.id, role: user.role })
        
        return {
            message: "user successfully created",
            data: {
                accessToken,
                user
            }
        }
    }
    
    async login(payload: LoginUserDto) {
        const user = await this.#_checkUserUserByEmail(payload.email)

        const iUserMatch = bcrypt.compareSync(payload.password, user.password)
        if (!iUserMatch) {
            throw new ConflictException('password not true given')
        }
        const accessToken = this.jwtHelper.generateToken({ id: user.id, role: user.role })
        return {
            message: "successfuly login",
            data: {
                accessToken,
                user
            }
        }
    }

    async #_checkExistingUserByEmail(email: string) {
        const user = await this.userModel.findOne({ where: { email } })

        if (user) {
            throw new ConflictException('siz avval royhatdan otgansiz')
        }
    }
    async #_checkUserUserByEmail(email: string) {
        const user = await this.userModel.findOne({ where: { email } })
        console.log(user);

        if (!user) {
            throw new ConflictException('siz avval royhatdan otmagansiz')
        }
        return user.toJSON()
    }
}