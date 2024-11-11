import { ValueObject } from "src/common/domain";

export class OrderReciviedDate extends ValueObject<OrderReciviedDate> {
    private date: Date;

    private constructor(date: Date) {
        super();
 
        //if(!date) { throw new EmptyOrderReciviedDateException('No se pudo obtener un Id de curso') /* throw DomainException NullCourseId */}

        this.date = date;
    }

    equals(obj: OrderReciviedDate): boolean {
        return this.date == obj.date;
    }

    get OrderReciviedDate() {
        return this.date;
    }

    public static create(date: Date): OrderReciviedDate {
        return new OrderReciviedDate(date);
    }
}