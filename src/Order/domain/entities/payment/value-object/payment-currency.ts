import { ValueObject } from "src/common/domain"
import { InvalidPaymentCurrencyException } from "src/order/domain/exception/invalid-order-payment-currency-exception";
import { OrderCurrencyEnum } from "src/order/domain/value_objects/enum/order-enum-currency-total-amoun";


export class PaymentCurrency implements ValueObject<PaymentCurrency> {

    private readonly currency: string
    
    private constructor(currency:string){

        if(OrderCurrencyEnum.bsf != currency &&
            OrderCurrencyEnum.usd != currency &&
            OrderCurrencyEnum.eur != currency 
        ) { throw new InvalidPaymentCurrencyException()}

        this.currency=currency;
    }

    equals(valueObject: PaymentCurrency): boolean {
        if (this.Value===valueObject.Value) return true
        return false
    }
    
    get Value(){ 
        return this.currency 
    }

    static create ( currency: string ): PaymentCurrency {
        return new PaymentCurrency( currency )
    }


}