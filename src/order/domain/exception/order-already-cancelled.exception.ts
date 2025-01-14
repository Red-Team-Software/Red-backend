import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export class ErrorOrderAlreadyCancelledException extends DomainException{
    constructor(msg: string) {
        super(msg);
    }
}