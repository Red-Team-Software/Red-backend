import { ValueObject } from "src/common/domain";
import { EmptyOrderCreatedDateException } from "../exception/empty-order-created-date.exception";

export class OrderCreatedDate extends ValueObject<OrderCreatedDate> {
    private date: Date;

    private constructor(date: Date) {
        super();

        if(!date) { throw new EmptyOrderCreatedDateException()}

        this.date = date;
    }

    equals(obj: OrderCreatedDate): boolean {
        return this.date == obj.date;
    }

    get OrderCreatedDate() {
        return this.date;
    }

    public static create(date: Date): OrderCreatedDate {
        return new OrderCreatedDate(date);
    }
}