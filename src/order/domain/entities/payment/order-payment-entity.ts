import { Entity } from "src/common/domain";
import { PaymentId } from "./value-object/payment-id";
import { PaymentMethod } from './value-object/payment-method';
import { PaymentAmount } from "./value-object/payment-amount";
import { PaymentCurrency } from "./value-object/payment-currency";



export class OrderPayment extends Entity<PaymentId> {
    
    constructor(
        private orderPaymentId: PaymentId,
        private paymentMethod: PaymentMethod,
        private paymentAmount: PaymentAmount,
        private paymentCurrency: PaymentCurrency
    ) {
        super(orderPaymentId);
    }

    static create(
        orderPaymentId: PaymentId,
        paymentMethod: PaymentMethod,
        paymentAmount: PaymentAmount,
        paymentCurrency: PaymentCurrency
    ): OrderPayment {
        return new OrderPayment(
            orderPaymentId,
            paymentMethod,
            paymentAmount,
            paymentCurrency
        );
    }

    get OrderPaymentId(): PaymentId {
        return this.orderPaymentId;
    }

    get PaymentMethods(): PaymentMethod {
        return this.paymentMethod;
    }

    get PaymentAmount(): PaymentAmount {
        return this.paymentAmount;
    }

    get PaymentCurrency(): PaymentCurrency {
        return this.paymentCurrency;
    }

}