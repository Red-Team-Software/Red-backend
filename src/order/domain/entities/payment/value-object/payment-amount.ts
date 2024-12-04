import { ValueObject } from "src/common/domain"
import { NegativePaymentAmountException } from "src/order/domain/entities/payment/exceptions/negative-order-payment-amoun-exception"


export class PaymentAmount implements ValueObject<PaymentAmount> {

    private readonly amount: number
    
    private constructor(amount:number){
        if (amount<=0) { new NegativePaymentAmountException() }
        this.amount=amount
    }

    equals(valueObject: PaymentAmount): boolean {
        if (this.Value===valueObject.Value) return true
        return false
    }
    
    get Value(){ 
        return this.amount 
    }

    static create ( amount: number ): PaymentAmount {
        return new PaymentAmount( amount )
    }


}