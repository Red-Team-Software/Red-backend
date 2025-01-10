import { Entity } from "src/common/domain";
import { Ballance } from "./value-objects/balance";
import { WalletId } from "./value-objects/wallet-id";


export class Wallet extends Entity<WalletId> {
    
    constructor(
        walletId: WalletId,
        private balance: Ballance
    ) {
        super(walletId);
    }

    static create(
        walletId: WalletId,
        balance: Ballance
    ): Wallet {
        return new Wallet(
            walletId,
            balance
        );
    }

    get Ballance(): Ballance {
        return this.balance;
    }

    updateBalance(balance: Ballance): Wallet {
        this.balance = balance;

        return this;
    }
    
}