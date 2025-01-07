import { DomainEvent } from "src/common/domain";
import { OrderCreatedDate } from "../value_objects/order-created-date";
import { OrderReceivedDate } from "../value_objects/order-received-date";
import { OrderTotalAmount } from "../value_objects/order-totalAmount";
import { OrderId } from "../value_objects/order-id";
import { OrderState } from "../value_objects/order-state";
import { OrderDirection } from '../value_objects/order-direction';
import { ProductDetail } from "../entities/product-detail/product-detail-entity";
import { OrderReport } from "../entities/report/report-entity";
import { OrderPayment } from "../entities/payment/order-payment-entity";
import { OrderCourier } from "../entities/order-courier/order-courier-entity";
import { OrderUserId } from "../value_objects/order-user-id";
import { BundleDetail } from "../entities/bundle-detail/bundle-detail-entity";


export class OrderRegistered extends DomainEvent {
    
    serialize(): string {
        let data = {
            orderId: this.orderId.orderId,
            orderState: this.orderState.orderState,
            orderCreateDate: this.orderCreateDate.OrderCreatedDate,
            totalAmount: this.totalAmount,
            orderDirection: this.orderDirection,
            orderCourier: {
                id:this.orderCourier.getId().OrderCourierId,
            },
            orderUserId: this.orderUserId.userId,
            products: this.products
            ? this.products.map(p=>({
                id:p.ProductDetailId.productDetailId,
                quantity:p.Quantity.Quantity
            }))
            : [],
            bundles: this.bundles 
            ? this.bundles.map(b=>({
                id:b.BundleDetailId.BundleDetailId,
                quantity:b.Quantity.Quantity
            }))
            :[],
            orderReceivedDate: this.orderReceivedDate
            ? this.orderReceivedDate.OrderReceivedDate
            : null,
            orderReport: this.orderReport
            ? {
                id:this.orderReport.getId().OrderReportId,
                description:this.orderReport.Description
            }
            : null,
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
        public products?: ProductDetail[],
        public bundles?: BundleDetail[],
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
        products?: ProductDetail[],
        bundles?: BundleDetail[],
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