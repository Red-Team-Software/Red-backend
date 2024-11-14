import { AggregateRoot, DomainEvent, Entity } from "src/common/domain";
import { OrderId } from "../value_objects/orderId";
import { OrderState } from "../value_objects/orderState";
import { OrderTotalAmount } from "../value_objects/order-totalAmount";
import { OrderReciviedDate } from "../value_objects/order-recivied-date";
import { OrderCreatedDate } from "../value_objects/order-created-date";
import { OrderReportId } from "../value_objects/order-reportId";
import { OrderPayment } from "../value_objects/order-payment";
import { OrderRegistered } from "../domain-events/order-registered";
import { OrderDirection } from "../value_objects/order-direction";
import { MissingOrderAtributes } from "../exception/missing-order-attributes.exception";
import { OrderBundle } from "../entities/order-bundle/order-bundle-entity";
import { OrderProduct } from "../entities/order-product/order-product-entity";
import { OrderProductId } from "../entities/order-product/value_object/order-productId";
import { OrderProductQuantity } from "../entities/order-product/value_object/order-Product-quantity";
import { OrderBundleId } from "../entities/order-bundle/value_object/order-bundlesId";
import { OrderBundleQuantity } from "../entities/order-bundle/value_object/order-bundle-quantity";
import { EmptyProductBundleAtributes } from "../exception/product-bundle-empty.exception";

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

        // if (this.products.length === 0 && this.bundles.length === 0) {
        //     throw new EmptyProductBundleAtributes('There must be at least one product or bundle')
        // }
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
        private products?: OrderProduct[],
        private bundles?: OrderBundle[],
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
        products?: OrderProduct[],
        bundles?: OrderBundle[],
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
        products?: OrderProduct[],
        bundles?: OrderBundle[],
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

    createOrderProduct(id: OrderProductId, quantity: OrderProductQuantity): OrderProduct {
        let product = OrderProduct.create(id, quantity);
        return product;
    }

    createOrderBundle(id: OrderBundleId, quantity: OrderBundleQuantity): OrderBundle {
        let bundle = OrderBundle.create(id, quantity);
        return bundle;
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

    get Products(): OrderProduct[] {
        return this.products;
    }

    get Bundles(): OrderBundle[] {
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

    OrderSetProducts(products: OrderProduct[]) {
        this.products = products;
    }

    OrderSetBundles(bundles: OrderBundle[]) {
        this.bundles = bundles;
    }
    
}