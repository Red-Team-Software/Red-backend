import { BaseException } from "src/common/utils/base-exception/base-exception";
import { BaseExceptionEnum } from "src/common/utils/enum/base-exception.enum";

export abstract class DomainException extends BaseException {
    constructor(msg: string) {
        super(msg);
        this.type=BaseExceptionEnum.DOMAIN_EXCEPTION
        // Object.setPrototypeOf(this, DomainException.prototype);
    }
}