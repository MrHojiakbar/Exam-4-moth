import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";

@Catch()
export class AllExceptionsFilters implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx=host.switchToHttp();const response=ctx.getResponse()
        const request=ctx.getRequest()
        let status=exception instanceof HttpException ? exception.getStatus():500
        let messages=exception instanceof HttpException ? exception.getResponse():"Internal server error"
        let details:any[]=[]
        if (Array.isArray((messages as any).message)) {
            details=(messages as any).message.map((err)=>{return { filed:err.split(" ")[0],message:err }})
        }
        console.log(exception);
        
        response.send({
            status,
            message:(messages as any).message,
            timestanps:new Date().toISOString(),
            path:request.url,
            details:details.length==0?null:details
        })

    }
}