import { AggregateRoot, DomainEvent, Entity } from "src/common/domain";
import { OrderId } from "../value_objects/orderId";
import { OrderState } from "../value_objects/orderState";
import { OrderBundleId } from "../value_objects/order-bundlesId";
import { OrderTotalAmount } from "../value_objects/order-totalAmount";
import { OrderProductId } from "../value_objects/order-productId";
import { OrderReciviedDate } from "../value_objects/order-recivied-date";
import { OrderCreatedDate } from "../value_objects/order-created-date";
import { OrderReportId } from "../value_objects/order-reportId";
import { OrderPayment } from "../value_objects/order-payment";
import { OrderRegistered } from "../domain-events/order-registered";
import { PayOrder } from "../domain-events/pay-order";

export class Order extends AggregateRoot<OrderId>{
    
    private orderState: OrderState;
    private orderCreatedDate: OrderCreatedDate;
    private totalAmount: OrderTotalAmount;
    private orderReciviedDate?: OrderReciviedDate;
    //private directionOrder: OrderProductId[];
    private products?: OrderProductId[];
    private bundles?: OrderBundleId[];
    private orderReport?: OrderReportId;
    private orderPayment?: OrderPayment;
    
    protected when(event: DomainEvent): void {
        if (event instanceof OrderRegistered) {
            this.orderState = event.orderState;
            this.orderCreatedDate = event.orderCreateDate;
            this.totalAmount = event.totalAmount;
            this.orderReciviedDate = event.orderReciviedDate;
            this.products = event.products;
            this.bundles = event.bundles;
            this.orderReport = event.orderReport;
            this.orderPayment = event.orderPayment;
        }
        if (event instanceof PayOrder) {
            this.orderPayment = event.orderPayment;
        }
    }
    
    protected validateState(): void {
    
    }
    clone(): Entity<OrderId> {
        throw new Error("Method not implemented.");
    }

    constructor(
        id: OrderId,
        orderState: OrderState,
        orderCreatedDate: OrderCreatedDate,
        totalAmount: OrderTotalAmount,
        orderReciviedDate?: OrderReciviedDate,
        products?: OrderProductId[],
        bundles?: OrderBundleId[],
        orderReport?: OrderReportId,
        orderPayment?: OrderPayment
    ) {
        super(id);
    }

    static registerOrder(
        id: OrderId,
        orderState: OrderState,
        orderCreatedDate: OrderCreatedDate,
        totalAmount: OrderTotalAmount,
        orderReciviedDate?: OrderReciviedDate,
        products?: OrderProductId[],
        bundles?: OrderBundleId[],
        orderReport?: OrderReportId,
        orderPayment?: OrderPayment
    ): Order {
        let order = new Order(
            id,
            orderState,
            orderCreatedDate,
            totalAmount,
            orderReciviedDate,
            products,
            bundles,
            orderReport,
            orderPayment
        );
        order.when(
            OrderRegistered.create(
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
        );
        return order;
    }
    
    
    static initializeAggregate(
        id: OrderId,
        orderState: OrderState,
        orderCreateDate: OrderCreatedDate,
        totalAmount: OrderTotalAmount,
        orderReciviedDate?: OrderReciviedDate,
        products?: OrderProductId[],
        bundles?: OrderBundleId[],
        orderReport?: OrderReportId,
        orderPayment?: OrderPayment

    ): Order {
        let order = new Order(
            id,
            orderState,
            orderCreateDate,
            totalAmount,
            orderReciviedDate,
            products,
            bundles,
            orderReport,
            orderPayment
        );
        order.validateState();
        return order;
    }

    payOrder(pay: OrderPayment): void {
        this.orderPayment = pay;
    }

    get OrderState(): OrderState {
        return this.orderState;
    }

    get OrderCreatedDate(): OrderCreatedDate {
        return this.orderCreatedDate;
    }

    get TotalAmount(): OrderTotalAmount {
        return this.totalAmount;
    }

    get OrderReciviedDate(): OrderReciviedDate {
        return this.orderReciviedDate;
    }

    get Products(): OrderProductId[] {
        return this.products;
    }

    get Bundles(): OrderBundleId[] {
        return this.bundles;
    }

    get OrderReport(): OrderReportId {
        return this.orderReport;
    }

    get OrderPayment(): OrderPayment {
        return this.orderPayment;
    }
    
}