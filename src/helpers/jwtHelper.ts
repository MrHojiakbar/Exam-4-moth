import { ConflictException, ForbiddenException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { JsonWebTokenError, JwtService, TokenExpiredError } from "@nestjs/jwt";

@Injectable()
export class JwtHelper {
    constructor(private jwt: JwtService) {}

    generateToken(data: { id: number, role: string }): object {
        
        const accessToken = this.jwt.sign(data,{secret:process.env.ACCESS_TOKEN_SECRET, expiresIn:process.env.ACCESS_TOKEN_EXPIRE_TIME?+process.env.ACCESS_TOKEN_EXPIRE_TIME:900});
        return { accessToken };                                                                             
    }

    verifyToken(token: string): { id: number, role: string } {
        try {

            const data = this.jwt.verify(token,{secret:process.env.ACCESS_TOKEN_SECRET})
            
            return data;
        } catch (err) {
            console.log(err);
            if (err instanceof TokenExpiredError) {
                throw new ForbiddenException('Token expired time');
            }

            if (err instanceof JsonWebTokenError) {
                throw new ConflictException("Token format not true given or Token");
            }
            
            throw new InternalServerErrorException('Internal Server Error');
        }
    }
}
