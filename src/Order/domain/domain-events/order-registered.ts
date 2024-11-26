import { DomainEvent } from "src/common/domain";
import { OrderCreatedDate } from "../value_objects/order-created-date";
import { OrderReceivedDate } from "../value_objects/order-received-date";
import { OrderTotalAmount } from "../value_objects/order-totalAmount";
import { OrderId } from "../value_objects/orderId";
import { OrderState } from "../value_objects/orderState";
import { OrderDirection } from '../value_objects/order-direction';
import { OrderProduct } from "../entities/order-product/order-product-entity";
import { OrderBundle } from "../entities/order-bundle/order-bundle-entity";
import { OrderReport } from "../entities/report/report-entity";
import { OrderPayment } from "../entities/payment/order-payment-entity";


export class OrderRegistered extends DomainEvent {
    
    serialize(): string {
        let data = {
            orderId: this.orderId.orderId,
            orderState: this.orderState.orderState,
            orderCreateDate: this.orderCreateDate.OrderCreatedDate,
            totalAmount: this.totalAmount,
            orderDirection: this.orderDirection,
            products: this.products,
            bundles: this.bundles,
            orderReceivedDate: this.orderReceivedDate?.OrderReceivedDate,
            orderReport: this.orderReport?.OrderReportId,
            orderPayment: this.orderPayment
        }
        
        return JSON.stringify(data);
    }

    constructor(
        public orderId: OrderId,
        public orderState: OrderState,
        public orderCreateDate: OrderCreatedDate,
        public totalAmount: OrderTotalAmount,
        public orderDirection: OrderDirection,
        public products?: OrderProduct[],
        public bundles?: OrderBundle[],
        public orderReceivedDate?: OrderReceivedDate,
        public orderReport?: OrderReport,
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
        products?: OrderProduct[],
        bundles?: OrderBundle[],
        orderReceivedDate?: OrderReceivedDate,
        orderReport?: OrderReport,
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
            orderReceivedDate,
            orderReport,
            orderPayment
        );
        return order;
    }

    

}