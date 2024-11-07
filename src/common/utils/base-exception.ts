import { BaseExceptionEnum } from "./enum/base-exception.enum";

export abstract class BaseException extends Error {
    protected type:BaseExceptionEnum
    constructor(msg: string) {
        super(msg);
        this.type=BaseExceptionEnum.NOT_REGISTERED
    }
    get Type():BaseExceptionEnum{return this.type}
}