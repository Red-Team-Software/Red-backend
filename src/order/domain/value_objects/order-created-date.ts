import { ValueObject } from "src/common/domain";

export class OrderCreatedDate extends ValueObject<OrderCreatedDate> {
    private date: Date;

    private constructor(date: Date) {
        super();
 
        //if(!date) { throw new EmptyOrderCreatedDateException('No se pudo obtener un Id de curso') /* throw DomainException NullCourseId */}

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