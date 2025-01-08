import { ValueObject } from "src/common/domain";
import { OrderCurrencyEnum } from "../enum/order-enum-currency-total-amoun";
import { InvalidConvertAmountException } from "../../exception/domain-services/invalid-currency-convert-amount-exception";
import { NegativeConvertAmountException } from "../../exception/domain-services/negative-convert-amount-exception";


export class ConvertAmount extends ValueObject<ConvertAmount> {
    private amount: number;
    private currency: string;

    private constructor(amount: number, currency: string) {
        super();

        if(amount<0) { throw new NegativeConvertAmountException()}
        if(OrderCurrencyEnum.bsf != currency &&
            OrderCurrencyEnum.usd != currency &&
            OrderCurrencyEnum.eur != currency 
        ) { throw new InvalidConvertAmountException()}


        this.currency = currency;
        this.amount = amount;
    }

    equals(obj: ConvertAmount): boolean {
        if( 
            obj.currency == this.currency 
            && obj.amount == this.amount
        ) return true;
        return false;
    }

    get Amount() {
        return this.amount;
    }

    get Currency() {
        return this.currency;
    }

    public static create(amount: number, currency: string): ConvertAmount {
        return new ConvertAmount(amount, currency);
    }
}