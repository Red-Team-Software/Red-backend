import { DomainEvent } from "src/common/domain";
import { OrderBundleId } from "../value_objects/order-bundlesId";
import { OrderCreatedDate } from "../value_objects/order-created-date";
import { OrderPayment } from "../value_objects/order-payment";
import { OrderProductId } from "../value_objects/order-productId";
import { OrderReciviedDate } from "../value_objects/order-recivied-date";
import { OrderReportId } from "../value_objects/order-reportId";
import { OrderTotalAmount } from "../value_objects/order-totalAmount";
import { OrderId } from "../value_objects/orderId";
import { OrderState } from "../value_objects/orderState";
import { OrderDirection } from '../value_objects/order-direction';


export class OrderRegistered extends DomainEvent {
    
    serialize(): string {
        return '';
    }

    constructor(
        public orderId: OrderId,
        public orderState: OrderState,
        public orderCreateDate: OrderCreatedDate,
        public totalAmount: OrderTotalAmount,
        public orderDirection: OrderDirection,
        public products?: OrderProductId[],
        public bundles?: OrderBundleId[],
        public orderReciviedDate?: OrderReciviedDate,
        public orderReport?: OrderReportId,
        public orderPayment?: OrderPayment,
    ){
        super();
    }

    static create (
        id: OrderId,
        orderState: OrderState,
        orderCreatedDate: OrderCreatedDate,
        totalAmount: OrderTotalAmount,
        orderDirection: OrderDirection,
        products?: OrderProductId[],
        bundles?: OrderBundleId[],
        orderReciviedDate?: OrderReciviedDate,
        orderReport?: OrderReportId,
        orderPayment?: OrderPayment
    ){
        let order = new OrderRegistered(
            id,
            orderState,
            orderCreatedDate,
            totalAmount,
            orderDirection,
            products,
            bundles,
            orderReciviedDate,
            orderReport,
            orderPayment
        );
        return order;
    }

    

}