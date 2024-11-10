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


export class OrderRegistered extends DomainEvent {
    
    serialize(): string {
        return '';
    }
    
    orderId: OrderId;
    orderState: OrderState;
    orderCreateDate: OrderCreatedDate;
    totalAmount: OrderTotalAmount;
    orderReciviedDate?: OrderReciviedDate;
    products?: OrderProductId[];
    bundles?: OrderBundleId[];
    orderReport?: OrderReportId;
    orderPayment?: OrderPayment;

    constructor(
        orderId: OrderId,
        orderState: OrderState,
        orderCreateDate: OrderCreatedDate,
        totalAmount: OrderTotalAmount,
        orderReciviedDate?: OrderReciviedDate,
        products?: OrderProductId[],
        bundles?: OrderBundleId[],
        orderReport?: OrderReportId,
        orderPayment?: OrderPayment,
    ){
        super();
    }

    static create (
        id: OrderId,
        orderState: OrderState,
        orderCreatedDate: OrderCreatedDate,
        totalAmount: OrderTotalAmount,
        orderReciviedDate?: OrderReciviedDate,
        products?: OrderProductId[],
        bundles?: OrderBundleId[],
        orderReport?: OrderReportId,
        orderPayment?: OrderPayment
    ){
        return new OrderRegistered(
            id,
            orderState,
            orderCreatedDate,
            totalAmount,
            orderReciviedDate,
            products,
            bundles,
            orderReport,
            orderPayment
        )
    }

    

}