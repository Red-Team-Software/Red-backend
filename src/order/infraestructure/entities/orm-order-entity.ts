import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { IOrderInterface } from "../orm-model-entity/order-interface";
import { OrmOrderPayEntity } from "./orm-order-payment";
import { OrmOrderProductEntity } from "./orm-order-product-entity";
import { OrmOrderBundleEntity } from "./orm-order-bundle-entity";
import { OrmOrderReportEntity } from "./orm-order-report-entity";
import { OrmOrderCourierEntity } from "./orm-order-courier-entity";

@Entity('order')
export class OrmOrderEntity implements IOrderInterface {
    
    @PrimaryColumn({ type: 'uuid' })
    id: string;

    @Column('varchar')
    state: string;

    @Column('date')
    orderCreatedDate: Date;

    @Column('numeric')
    totalAmount: number;

    @Column('varchar')
    currency: string;

    @Column('float')
    latitude: number;

    @Column('float')
    longitude: number;
    
    @OneToOne( () => OrmOrderPayEntity, (pay) => pay.order, { cascade: true } )
    @JoinColumn()
    pay?: OrmOrderPayEntity;

    @Column('date', { nullable: true })
    orderReceivedDate?: Date;

    @OneToMany(() => OrmOrderProductEntity, (orderProduct) => orderProduct.order, { cascade: true } )
    order_products?: OrmOrderProductEntity[];

    @OneToMany(() => OrmOrderBundleEntity, (orderBundle) => orderBundle.order, { cascade: true } )
    order_bundles?: OrmOrderBundleEntity[]

    @OneToOne( () => OrmOrderReportEntity, (orderReport) => orderReport.order, { cascade: true })
    @JoinColumn()
    order_report?: OrmOrderReportEntity;

    @OneToOne( () => OrmOrderCourierEntity, (orderCourier) => orderCourier.order_id, { cascade: true })
    @JoinColumn()
    order_courier?: OrmOrderCourierEntity;

    static create(
        id: string,
        orderState: string,
        orderCreatedDate: Date,
        totalAmount: number,
        currency: string,
        latitude: number,
        longitude: number,
        orderCourier: OrmOrderCourierEntity,
        pay?: OrmOrderPayEntity,
        orderProducts?: OrmOrderProductEntity[],
        orderBundles?: OrmOrderBundleEntity[],
        orderReceivedDate?: Date,
        orderReport?: OrmOrderReportEntity
    ): OrmOrderEntity {
        const order = new OrmOrderEntity();
        order.id = id;
        order.state = orderState;
        order.orderCreatedDate = orderCreatedDate;
        order.totalAmount = totalAmount;
        order.currency = currency;
        order.latitude = latitude;
        order.longitude = longitude;
        order.order_courier = orderCourier;
        order.pay = pay;
        order.order_products = orderProducts;
        order.order_bundles = orderBundles;
        order.orderReceivedDate = orderReceivedDate;
        order.order_report = orderReport;
        return order;
    }

}