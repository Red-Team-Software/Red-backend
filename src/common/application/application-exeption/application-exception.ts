import { BaseException } from "src/common/utils/base-exception";
import { BaseExceptionEnum } from "src/common/utils/enum/base-exception.enum";

export class ApplicationException extends BaseException {
    constructor(msg: string) {
        super(msg);
        this.type=BaseExceptionEnum.APPLICATION_EXCEPTION
    }
}