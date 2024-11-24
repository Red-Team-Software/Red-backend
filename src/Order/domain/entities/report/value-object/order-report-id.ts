import { ValueObject } from "src/common/domain";
import { EmptyOrderReportIdException } from "../exception/empty-order-report-id-exception";

export class OrderReportId extends ValueObject<OrderReportId> {
    private id: string;

    private constructor(id: string) {
        super();

        if(!id) throw new EmptyOrderReportIdException();

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