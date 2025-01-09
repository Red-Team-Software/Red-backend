import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export class ZeroQuantityBundleDetailException extends DomainException {
    constructor(message: string) {
        super(message);
    }
}