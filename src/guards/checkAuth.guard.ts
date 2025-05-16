import { BadRequestException, CanActivate, ConflictException, ExecutionContext, ForbiddenException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JsonWebTokenError, TokenExpiredError } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { PROTECTED_KEY } from "src/decorators/protected.decorator";
import { JwtHelper } from "src/helpers";
import { UserRoles } from "src/users/enums";

@Injectable()

export class CheckAuthGuard implements CanActivate {
    constructor(private reflektor: Reflector, private jwtHelper: JwtHelper) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const isProtected=this.reflektor.getAllAndOverride<boolean>(PROTECTED_KEY,[context.getHandler(),context.getClass()])
        const ctx=context.switchToHttp()

        const req=ctx.getRequest<Request & {role?:string,userId?:number}>()
        console.log("keldi");
        
        if (!isProtected) {
            req.role=UserRoles.USER
            return true
        }

        const token:string=req.headers['authorization']
        if (!token || !token.startsWith('Bearer')) {
            throw new BadRequestException('please Give Bearer token')
        }

        const accessToken=token.split('Bearer')[1].trim();

        if (!accessToken) {
            throw new BadRequestException('please Give AccessToken')
        }

        try {
            console.log(accessToken);
            const data=this.jwtHelper.verifyToken(accessToken)
            
            req.userId=data?.id
            req.role=data?.role
            return true
        } catch (err) {
            if (err instanceof TokenExpiredError) {
                throw new ForbiddenException('Token expired time');
              }
        
              if (err instanceof JsonWebTokenError) {
                throw new ConflictException("Token format not true given or Token");
              }
              
              throw new InternalServerErrorException('Internal server Error')
        }

    }
}