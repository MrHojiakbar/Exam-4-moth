import { CanActivate, ConflictException, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { ROLE_KEY } from "src/decorators/role.decorator";
import { UserRoles } from "src/users/enums";

@Injectable()

export class CheckRolesGuard implements CanActivate{
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const possibleRoles:string[]=this.reflector.getAllAndOverride(ROLE_KEY,[context.getHandler(),context.getClass()])
        const ctx=context.switchToHttp()

        const req=ctx.getRequest<Request & {role:UserRoles,userId:number}>()

        const userRole=req.role
        if (!possibleRoles.includes(userRole)) {
            throw new ForbiddenException(`You can't use this operation because you not ${possibleRoles.join(' or')}`)
        }
        return true
    }
}