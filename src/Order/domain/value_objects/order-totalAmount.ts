import { ValueObject } from "src/common/domain";

export class OrderTotalAmount extends ValueObject<OrderTotalAmount> {
    private amount: number;

    constructor(amount: number) {
        super();
 
        //if(!amount) { throw new EmptyOrderTotalAmountException('No se pudo obtener un Id de curso') /* throw DomainException NullCourseId */}

        this.amount = amount;
    }

    equals(obj: OrderTotalAmount): boolean {
        return this.amount == obj.amount;
    }

    get OrderTotalAmount() {
        return this.amount;
    }

    public static create(amount: number): OrderTotalAmount {
        return new OrderTotalAmount(amount);
    }
}