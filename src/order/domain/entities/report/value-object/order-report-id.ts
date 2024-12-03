import { ValueObject } from "src/common/domain";
import { EmptyOrderReportIdException } from "../exception/empty-order-report-id-exception";
import { InvalidOrderReportIdException } from "../exception/invalid-report-id-exception";

export class OrderReportId extends ValueObject<OrderReportId> {
    private id: string;

    private constructor(id: string) {
        super();

        if(!id) throw new EmptyOrderReportIdException();
        const regex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$');
        if (!regex.test(id))  throw new InvalidOrderReportIdException();

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