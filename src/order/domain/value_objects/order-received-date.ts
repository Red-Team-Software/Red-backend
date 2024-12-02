import { ValueObject } from "src/common/domain";
import { EmptyOrderReceivedDateException } from "../exception/empty-order-received-date.exception";

export class OrderReceivedDate extends ValueObject<OrderReceivedDate> {
    private date: Date;

    private constructor(date: Date) {
        super();

        if(!date) { throw new EmptyOrderReceivedDateException()}

        this.date = date;
    }

    equals(obj: OrderReceivedDate): boolean {
        return this.date == obj.date;
    }

    get OrderReceivedDate() {
        return this.date;
    }

    public static create(date: Date): OrderReceivedDate {
        return new OrderReceivedDate(date);
    }
}