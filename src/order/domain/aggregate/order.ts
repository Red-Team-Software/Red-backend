import { AggregateRoot, DomainEvent, Entity } from "src/common/domain";
import { OrderId } from "../value_objects/order-id";
import { OrderState } from "../value_objects/order-state";
import { OrderTotalAmount } from "../value_objects/order-totalAmount";
import { OrderReceivedDate } from "../value_objects/order-received-date";
import { OrderCreatedDate } from "../value_objects/order-created-date";
import { OrderRegistered } from "../domain-events/order-registered";
import { OrderDirection } from "../value_objects/order-direction";
import { MissingOrderAtributes } from "../exception/missing-order-atributes.exception";
import { EmptyProductBundleAtributes } from "../exception/product-bundle-empty.exception";
import { OrderReport } from "../entities/report/report-entity";
import { OrderStatusCancelled } from "../domain-events/order-state-cancelled";
import { OrderPayment } from "../entities/payment/order-payment-entity";
import { OrderStatusDelivered } from "../domain-events/order-state-delivered";
import { OrderUserId } from '../value_objects/order-user-id';
import { CourierAssignedToDeliver } from "../domain-events/courier-assigned-to-deliver";
import { ProductDetail } from "../entities/product-detail/product-detail-entity";
import { BundleDetail } from "../entities/bundle-detail/bundle-detail-entity";
import { OrderCourierId } from "../value_objects/order-courier-id";
import { OrderCuponId } from "../value_objects/order-cupon-id";

export class Order extends AggregateRoot<OrderId>{
    
    protected when(event: DomainEvent): void {
        if (event instanceof OrderRegistered) {
            this.orderState = event.orderState;
            this.orderCreatedDate = event.orderCreateDate;
            this.totalAmount = event.totalAmount;
            this.orderDirection = event.orderDirection;
            this.orderCourierId = event.orderCourierId;
            this.products = event.products;
            this.bundles = event.bundles;
            this.orderReceivedDate = event.orderReceivedDate;
            this.orderReport = event.orderReport;
            this.orderPayment = event.orderPayment;
            this.orderUserId = event.orderUserId;
        }

        if (event instanceof OrderStatusCancelled) {
            this.orderState = event.orderState;
        }

        if (event instanceof OrderStatusDelivered) {
            this.orderState = event.orderState;
        }
    
        if (event instanceof CourierAssignedToDeliver) {
            this.orderState = event.orderState;
            this.orderCourierId = event.orderCourierId;
        }
    }
    
    protected validateState(): void {
        if (
            !this.orderState ||
            !this.orderCreatedDate ||
            !this.totalAmount ||
            !this.orderDirection ||
            !this.orderUserId
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
        private orderUserId: OrderUserId,
        public orderCupon?: OrderCuponId,
        private orderCourierId?: OrderCourierId,
        private products?: ProductDetail[],
        private bundles?: BundleDetail[],
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
        orderUserId: OrderUserId,
        orderCupon?: OrderCuponId,
        orderCourierId?: OrderCourierId,
        products?: ProductDetail[],
        bundles?: BundleDetail[],
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
            orderUserId,
            orderCupon,
            orderCourierId,
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
                orderUserId,
                orderCupon,
                orderCourierId,
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
        orderUserId: OrderUserId,
        orderCupon?: OrderCuponId,
        orderCourierId?: OrderCourierId,
        products?: ProductDetail[],
        bundles?: BundleDetail[],
        orderReceivedDate?: OrderReceivedDate,
        orderReport?: OrderReport,
        orderPayment?: OrderPayment
    ): Order {
        //TODO order payment opcional
        let order = new Order(
            id,
            orderState,
            orderCreateDate,
            totalAmount,
            orderDirection,
            orderUserId,
            orderCupon,
            orderCourierId,
            products,
            bundles,
            orderReceivedDate,
            orderReport,
            orderPayment
        );
        order.validateState();
        return order;
    }

    cancelOrder(): void {
        this.apply(
            OrderStatusCancelled.create(
                this.getId(),
                this.orderState.changeStateCancelled(),
                this.orderUserId
            )
        );
    }

    //! Le gane a alfredo, si puedo mandar una fecha desde afuera, recuerda cambiarlo
    orderDelivered(orderReceivedDate: OrderReceivedDate): void {
        this.apply(
            OrderStatusDelivered.create(
                this.getId(),
                this.orderState.changeStateDelivered(),
                this.orderUserId,
                orderReceivedDate
            )
        );
    }
    

    assignCourierToDeliver(orderCourierId: OrderCourierId,orderState: OrderState): void {
        this.apply(
            CourierAssignedToDeliver.create(
                this.getId(),
                orderState,
                this.orderUserId,
                orderCourierId
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

    get Products(): ProductDetail[] {
        return this.products;
    }

    get Bundles(): BundleDetail[] {
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

    get OrderCourierId(): OrderCourierId {
        return this.orderCourierId;
    }

    get OrderUserId(): OrderUserId {
        return this.orderUserId;
    }

    get OrderCuponId(): OrderCuponId {
        return this.orderCupon;
    }

}