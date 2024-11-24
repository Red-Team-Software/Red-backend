import { Entity } from "src/common/domain/entity/entity";
import { OrderReportId } from "./value-object/order-report-id";
import { OrderReportDescription } from "./value-object/order-report-description";


export class OrderReport extends Entity<OrderReportId> {
    
    constructor(
        private orderReportId: OrderReportId,
        private description: OrderReportDescription,
    ) {
        super(orderReportId);
    }

    static create(
        orderReportId: OrderReportId,
        description: OrderReportDescription
    ): OrderReport {
        return new OrderReport(
            orderReportId,
            description
        );
    }

    get OrderReportId(): OrderReportId {
        return this.orderReportId;
    }

    get Description(): OrderReportDescription {
        return this.description;
    }

}