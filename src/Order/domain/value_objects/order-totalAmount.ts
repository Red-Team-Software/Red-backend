import { ValueObject } from "src/common/domain";
import { NegativeOrderTotalAmountException } from "../exception/negative-order-total-amount-exception";
import { OrderCurrencyEnum } from "./enum/order-enum-currency-total-amoun";
import { InvalidCurrencyOrderTotalAmountException } from "../exception/invalid-currency-total-amount-order-exception";

export class OrderTotalAmount extends ValueObject<OrderTotalAmount> {
    private amount: number;
    private currency: string;

    private constructor(amount: number, currency: string) {
        super();
 
        if(amount<0) { throw new NegativeOrderTotalAmountException('The amount cannot be negative')}
        if(OrderCurrencyEnum.bsf != currency &&
            OrderCurrencyEnum.usd != currency &&
            OrderCurrencyEnum.eur != currency 
        ) { throw new InvalidCurrencyOrderTotalAmountException('The currency is not in the list of valid currencies')}


        this.currency = currency;
        this.amount = amount;
    }

    equals(obj: OrderTotalAmount): boolean {
        if( 
            obj.currency == this.currency 
            && obj.amount == this.amount
        ) return true;
        return false;
    }

    get OrderAmount() {
        return this.amount;
    }

    get OrderCurrency() {
        return this.currency;
    }

    public static create(amount: number, currency: string): OrderTotalAmount {
        return new OrderTotalAmount(amount, currency);
    }
}