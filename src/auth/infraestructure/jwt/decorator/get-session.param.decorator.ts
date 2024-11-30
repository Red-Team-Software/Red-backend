import { ExecutionContext, NotFoundException, createParamDecorator } from "@nestjs/common"

export const GetSession = createParamDecorator(
    (_data, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest()
        if (!request.session)
            throw new NotFoundException('session not foud')
        return request.session
    }
)