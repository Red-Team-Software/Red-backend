import { ValueObject } from "src/common/domain";
import { NegativeOrderShippingFeeException } from "../exception/negative-order-shipping-fee-exception";

export class OrderShippingFee extends ValueObject<OrderShippingFee> {
    private fee: number;

    private constructor(fee: number) {
        super();

        if(fee<0) { throw new NegativeOrderShippingFeeException('El shipping de la orden no puede ser negativo') /* throw DomainException NullCourseId */}

        this.fee = fee;
    }

    equals(obj: OrderShippingFee): boolean {
        return this.fee == obj.fee;
    }

    get OrderShippingFee() {
        return this.fee;
    }

    public static create(fee: number): OrderShippingFee {
        return new OrderShippingFee(fee);
    }
}