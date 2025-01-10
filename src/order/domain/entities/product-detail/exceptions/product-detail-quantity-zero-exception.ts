import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export class ZeroQuantityProductDetailException extends DomainException {
    constructor(message: string) {
        super(message);
    }
}