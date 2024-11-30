import { AggregateRoot, DomainEvent, Entity } from "src/common/domain";
import { OrderId } from "../value_objects/orderId";
import { OrderState } from "../value_objects/orderState";
import { OrderTotalAmount } from "../value_objects/order-totalAmount";
import { OrderReceivedDate } from "../value_objects/order-received-date";
import { OrderCreatedDate } from "../value_objects/order-created-date";
import { OrderRegistered } from "../domain-events/order-registered";
import { OrderDirection } from "../value_objects/order-direction";
import { MissingOrderAtributes } from "../exception/missing-order-attributes.exception";
import { OrderBundle } from "../entities/order-bundle/order-bundle-entity";
import { OrderProduct } from "../entities/order-product/order-product-entity";
import { EmptyProductBundleAtributes } from "../exception/product-bundle-empty.exception";
import { OrderReport } from "../entities/report/report-entity";
import { OrderStatusCanceled } from "../domain-events/order-state-canceled";
import { OrderPayment } from "../entities/payment/order-payment-entity";
import { OrderStatusUpdated } from "../domain-events/order-state-updated";
import { OrderCourier } from "../entities/order-courier/order-courier-entity";

export class Order extends AggregateRoot<OrderId>{
    
    protected when(event: DomainEvent): void {
        if (event instanceof OrderRegistered) {
            this.orderState = event.orderState;
            this.orderCreatedDate = event.orderCreateDate;
            this.totalAmount = event.totalAmount;
            this.orderDirection = event.orderDirection;
            this.orderCourier = event.orderCourier;
            this.products = event.products;
            this.bundles = event.bundles;
            this.orderReceivedDate = event.orderReceivedDate;
            this.orderReport = event.orderReport;
            this.orderPayment = event.orderPayment;
        }

        if (event instanceof OrderStatusCanceled) {
            this.orderState = event.orderState;
        }

        if (event instanceof OrderStatusUpdated) {
            this.orderState = event.orderState;
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

        if (this.products.length === 0 && this.bundles.length === 0) {
            throw new EmptyProductBundleAtributes('There must be at least one product or bundle')
        }
    }

    constructor(
        id: OrderId,
        private orderState: OrderState,
        private orderCreatedDate: OrderCreatedDate,
        private totalAmount: OrderTotalAmount,
        private orderDirection: OrderDirection,
        private orderCourier: OrderCourier,
        private products?: OrderProduct[],
        private bundles?: OrderBundle[],
        private orderReceivedDate?: OrderReceivedDate,
        private orderReport?: OrderReport,
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
        orderCourier: OrderCourier,
        products?: OrderProduct[],
        bundles?: OrderBundle[],
        orderReceivedDate?: OrderReceivedDate,
        orderReport?: OrderReport,
        orderPayment?: OrderPayment
    ): Order {
        let order = new Order(
            id,
            orderState,
            orderCreatedDate,
            totalAmount,
            orderDirection,
            orderCourier,
            products,
            bundles,
            orderReceivedDate,
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
                orderCourier,
                products,
                bundles,
                orderReceivedDate,
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
        orderCourier: OrderCourier,
        products?: OrderProduct[],
        bundles?: OrderBundle[],
        orderReceivedDate?: OrderReceivedDate,
        orderReport?: OrderReport,
        orderPayment?: OrderPayment

    ): Order {
        let order = new Order(
            id,
            orderState,
            orderCreateDate,
            totalAmount,
            orderDirection,
            orderCourier,
            products,
            bundles,
            orderReceivedDate,
            orderReport,
            orderPayment
        );
        order.validateState();
        return order;
    }

    cancelOrder(orderState: OrderState): void {
        this.apply(
            OrderStatusCanceled.create(
                this.getId(),
                orderState
            )
        );
    }

    updateOrderStatus(orderState: OrderState): void {
        this.apply(
            OrderStatusUpdated.create(
                this.getId(),
                orderState
            )
        );
    }

    addOrderReport(orderReport: OrderReport): void {
        this.orderReport = orderReport;
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

    get OrderReceivedDate(): OrderReceivedDate {
        return this.orderReceivedDate;
    }

    get Products(): OrderProduct[] {
        return this.products;
    }

    get Bundles(): OrderBundle[] {
        return this.bundles;
    }

    get OrderReport(): OrderReport {
        return this.orderReport;
    }

    get OrderPayment(): OrderPayment {
        return this.orderPayment;
    }

    get OrderDirection(): OrderDirection {
        return this.orderDirection;
    }

    get OrderCourier(): OrderCourier {
        return this.orderCourier;
    }

}