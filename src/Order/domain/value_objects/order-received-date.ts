import { ValueObject } from "src/common/domain";

export class OrderReceivedDate extends ValueObject<OrderReceivedDate> {
    private date: Date;

    private constructor(date: Date) {
        super();

        //if(!date) { throw new EmptyOrderReceivedDateException('No se pudo obtener un Id de curso') /* throw DomainException NullCourseId */}

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