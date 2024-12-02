import { DomainEvent } from "src/common/domain";
import { OrderCreatedDate } from "../value_objects/order-created-date";
import { OrderReceivedDate } from "../value_objects/order-received-date";
import { OrderTotalAmount } from "../value_objects/order-totalAmount";
import { OrderId } from "../value_objects/order-id";
import { OrderState } from "../value_objects/order-state";
import { OrderDirection } from '../value_objects/order-direction';
import { OrderProduct } from "../entities/order-product/order-product-entity";
import { OrderBundle } from "../entities/order-bundle/order-bundle-entity";
import { OrderReport } from "../entities/report/report-entity";
import { OrderPayment } from "../entities/payment/order-payment-entity";
import { OrderCourier } from "../entities/order-courier/order-courier-entity";
import { OrderUserId } from "../value_objects/order-user-id";


export class OrderRegistered extends DomainEvent {
    
    serialize(): string {
        let data = {
            orderId: this.orderId.orderId,
            orderState: this.orderState.orderState,
            orderCreateDate: this.orderCreateDate.OrderCreatedDate,
            totalAmount: this.totalAmount,
            orderDirection: this.orderDirection,
            orderCourier: this.orderCourier,
            orderUserId: this.orderUserId,
            products: this.products,
            bundles: this.bundles,
            orderReceivedDate: this.orderReceivedDate?.OrderReceivedDate,
            orderReport: this.orderReport?.getId(),
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
        public orderCourier: OrderCourier,
        public orderUserId: OrderUserId,
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
        orderCourier: OrderCourier,
        orderUserId: OrderUserId,
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
            orderCourier,
            orderUserId,
            products,
            bundles,
            orderReceivedDate,
            orderReport,
            orderPayment
        );
        return order;
    }

    

}