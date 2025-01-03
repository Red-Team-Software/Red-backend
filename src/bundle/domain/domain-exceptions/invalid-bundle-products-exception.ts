import { DomainException } from "src/common/domain/domain-exception/domain-exception";
export class InvalidBundleProductsException extends DomainException{
    constructor(){
        super(`The bundle has only one product but needs at least two products`)
    }
}