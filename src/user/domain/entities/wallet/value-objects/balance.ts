import { ValueObject } from "src/common/domain"
import { WalletCurrencyEnum } from "./enums/wallet-currency.enum"
import { InvalidBallanceAmountException } from "../domain-exceptions/invalid-ballance-amount-exception"
import { InvalidBallanceCurrencyException } from "../domain-exceptions/invalid-ballance-currency-exception"


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
        if (amount<0) 
            throw new InvalidBallanceAmountException(amount)
        if ( !WalletCurrencyEnum[currency]) 
            throw new InvalidBallanceCurrencyException(currency)
        this.currency=currency
        this.amount=amount
    }

    reduceAmount(b:Ballance):Ballance{
        return new Ballance(
            this.Amount-b.Amount,
            this.Currency
        )
    }

    addAmount(b:Ballance):Ballance{
        return new Ballance(
            b.Amount+this.Amount,
            this.Currency
        )
    }
}