import { ValueObject } from "src/common/domain"
import { InvalidBallanceException } from "../domain-exceptions/invalid-ballance-exception"
import { WalletCurrencyEnum } from "./enums/wallet-currency.enum"


export class Ballance implements ValueObject<Ballance> {

    private readonly currency:string
    private readonly amount: number

    equals(valueObject: Ballance): boolean {
        if (this.amount===valueObject.amount &&
            this.Currency===valueObject.Currency
        ) return true
        return false
    }
    
    get Amount(){ return this.amount }

    get Currency(){ return this.currency }

    static create ( amount: number, currency:string): Ballance {
        return new Ballance( amount,currency )
    }

    private constructor(amount:number,currency:string){
        if (amount<0) throw new InvalidBallanceException(currency,amount)
        if ( 
            WalletCurrencyEnum.bsf != currency &&
            WalletCurrencyEnum.eur != currency &&
            WalletCurrencyEnum.usd != currency
        ) throw new InvalidBallanceException(currency,amount)
        this.currency=currency
        this.amount=amount
    }

}