import {
    BadRequestException,
    NotFoundException,
    InternalServerErrorException,
    ForbiddenException,
} from '@nestjs/common';

export class HttpResponseHandler {

    static HandleException(error: any) {
        throw new Error('se necesita agregar los errores')
    }

    
}
