import { ExecutionContext, NotFoundException, createParamDecorator } from "@nestjs/common"

export const GetCourierCredential = createParamDecorator(
    (_data, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest()
        if (!request.credential) 
            throw new NotFoundException(' 404 credential not found')
        return request.credential
    }
)