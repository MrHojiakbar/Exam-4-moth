import { Body, Controller, Post } from "@nestjs/common";
import { LoginUserDto, RegisterUserDto } from "./dtos";
import { AuthService } from "./auth.service";
import { UserRoles } from "./enums";
import { Roles } from "src/decorators/role.decorator";
import { Protected } from "src/decorators/protected.decorator";

@Controller("auth")
export class AuthController {
    constructor(private service:AuthService) {}

    @Post('sign-up')
    @Protected(false)
    @Roles([UserRoles.ADMIN,UserRoles.USER])
    async signUp(@Body() payload:RegisterUserDto) {
        return await this.service.register(payload)
    }
    @Post('sign-in')
    @Protected(false)
    @Roles([UserRoles.ADMIN,UserRoles.USER])
    async signIn(@Body() payload:LoginUserDto) {
        return await this.service.login(payload)
    }
}