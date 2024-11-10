import { ValueObject } from "src/common/domain";

export class OrderReportId extends ValueObject<OrderReportId> {
    private id: string;

    constructor(id: string) {
        super();
 
        //if(!id) { throw new EmptyOrderReportIdException('No se pudo obtener un Id de curso') /* throw DomainException NullCourseId */}

        this.id = id;
    }

    equals(obj: OrderReportId): boolean {
        return this.id == obj.id;
    }

    get OrderReportId() {
        return this.id;
    }

    public static create(id: string): OrderReportId {
        return new OrderReportId(id);
    }
}