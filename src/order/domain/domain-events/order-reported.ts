import { DomainEvent } from "src/common/domain";
import { OrderId } from "../value_objects/order-id";
import { OrderReport } from "../entities/report/report-entity";


export class OrderReported extends DomainEvent {
    
    serialize(): string {
        let data = {
            orderId: this.orderId.orderId,
            orderReport:
            {
                id:this.orderReport.getId().OrderReportId,
                description:this.orderReport.Description.Value
            }
        }
        
        return JSON.stringify(data);
    }

    constructor(
        public orderId: OrderId,
        public orderReport: OrderReport
    ){
        super();
    }

    static create (
        id: OrderId,
        orderReport: OrderReport
    ){
        let order = new OrderReported(
            id,
            orderReport
        );
        return order;
    }

    

}