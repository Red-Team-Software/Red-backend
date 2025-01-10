import { DomainEvent } from "src/common/domain"
import { Wallet } from "../entities/wallet/wallet.entity"
import { UserId } from "../value-object/user-id"

export class UserBalanceAmountAdded extends DomainEvent {
    serialize(): string {
        let data= {  
            userId:this.userId.Value,
            userWallet:{
                amount: this.userWallet.Ballance.Amount,
                currency: this.userWallet.Ballance.Currency            
            }  
        }
        return JSON.stringify(data)
    }
    static create(
        userId:UserId,
        userWallet:Wallet
    ){
        return new UserBalanceAmountAdded(
            userId,
            userWallet
        )
    }
    constructor(
        public userId:UserId,
        public userWallet:Wallet
    ){
        super()
    }
}