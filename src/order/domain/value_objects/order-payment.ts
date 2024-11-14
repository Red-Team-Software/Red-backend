import { ValueObject } from "src/common/domain";
import { NegativePaymentAmountException } from "../exception/negative-order-payment-amoun-exception";
import { OrderCurrencyEnum } from "./enum/order-enum-currency-total-amoun";
import { InvalidPaymentCurrencyException } from "../exception/invalid-order-payment-currency-exception";

export class OrderPayment extends ValueObject<OrderPayment> {
    private amount: number;
    private currency: string;
    private paymentMethod: string;

    private constructor(amount: number, currency: string, paymentMethod: string) {
        super();
 
        if(amount<0) { throw new NegativePaymentAmountException('El monto del pago no puede ser negativo')}
        if(OrderCurrencyEnum.bsf != currency &&
            OrderCurrencyEnum.usd != currency &&
            OrderCurrencyEnum.eur != currency 
        ) { throw new InvalidPaymentCurrencyException('La moneda no puede ser nula')}


        this.amount = amount;
        this.currency = currency;
        this.paymentMethod = paymentMethod;
    }

    equals(obj: OrderPayment): boolean {
        if (obj.amount == this.amount
            && obj.currency == this.currency
            && obj.paymentMethod == this.paymentMethod
        ) return true;
        return false;
    }

    get Amount():number {
        return this.amount;
    }

    get Currency():string {
        return this.currency;
    }

    get PaymentMethod():string {
        return this.paymentMethod;
    }

    public static create(amount: number, currency: string, paymentMethod: string): OrderPayment {
        return new OrderPayment(amount, currency, paymentMethod);
    }
}