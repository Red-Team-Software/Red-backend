import { ValueObject } from "src/common/domain";

export class OrderShippingFee extends ValueObject<OrderShippingFee> {
    private fee: number;

    constructor(fee: number) {
        super();
 
        //if(!fee) { throw new EmptyOrderShippingFeeException('No se pudo obtener un Id de curso') /* throw DomainException NullCourseId */}

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