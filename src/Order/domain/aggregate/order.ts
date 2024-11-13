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
import { OrderDirection } from "../value_objects/order-direction";
import { MissingOrderAtributes } from "../exception/missing-order-attributes.exception";

export class Order extends AggregateRoot<OrderId>{
    
    protected when(event: DomainEvent): void {
        if (event instanceof OrderRegistered) {
            this.orderState = event.orderState;
            this.orderCreatedDate = event.orderCreateDate;
            this.totalAmount = event.totalAmount;
            this.orderDirection = event.orderDirection;
            this.products = event.products;
            this.bundles = event.bundles;
            this.orderReciviedDate = event.orderReciviedDate;
            this.orderReport = event.orderReport;
            this.orderPayment = event.orderPayment;
        }
    }
    
    protected validateState(): void {
        if (
            !this.orderState ||
            !this.orderCreatedDate ||
            !this.totalAmount ||
            !this.orderDirection 
        ) {
            throw new MissingOrderAtributes('The order is invalid, information is missing');
        }
    }
    
    clone(): Entity<OrderId> {
        throw new Error("Method not implemented.");
    }

    constructor(
        id: OrderId,
        private orderState: OrderState,
        private orderCreatedDate: OrderCreatedDate,
        private totalAmount: OrderTotalAmount,
        private orderDirection: OrderDirection,
        private products?: OrderProductId[],
        private bundles?: OrderBundleId[],
        private orderReciviedDate?: OrderReciviedDate,
        private orderReport?: OrderReportId,
        private orderPayment?: OrderPayment
    ) {
        super(id);
    }

    static registerOrder(
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
    ): Order {
        let order = new Order(
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
        order.apply(
            OrderRegistered.create(
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
            )
        );
        return order;
    }
    
    
    static initializeAggregate(
        id: OrderId,
        orderState: OrderState,
        orderCreateDate: OrderCreatedDate,
        totalAmount: OrderTotalAmount,
        orderDirection: OrderDirection,
        products?: OrderProductId[],
        bundles?: OrderBundleId[],
        orderReciviedDate?: OrderReciviedDate,
        orderReport?: OrderReportId,
        orderPayment?: OrderPayment

    ): Order {
        let order = new Order(
            id,
            orderState,
            orderCreateDate,
            totalAmount,
            orderDirection,
            products,
            bundles,
            orderReciviedDate,
            orderReport,
            orderPayment
        );
        order.validateState();
        return order;
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

    get OrderDirection(): OrderDirection {
        return this.orderDirection;
    }
    
}