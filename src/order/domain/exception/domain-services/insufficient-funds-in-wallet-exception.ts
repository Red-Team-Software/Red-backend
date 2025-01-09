import { DomainException } from "src/common/domain/domain-exception/domain-exception";


export class InsufficientFundsInWalletException extends DomainException {
    constructor() {
        super('Insufficient funds in wallet, please add funds to your wallet');
    }
}