import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { IOrderInterface } from "../orm-model-entity/order-interface";
import { OrmOrderPayEntity } from "./orm-order-payment";
import { OrmOrderProductEntity } from "./orm-order-product-entity";
import { OrmOrderBundleEntity } from "./orm-order-bundle-entity";

@Entity('order')
export class OrmOrderEntity implements IOrderInterface {
    
    @PrimaryColumn({ type: 'uuid' })
    id: string;

    @Column('varchar')
    state: string;

    @Column('date')
    orderCreatedDate: Date;

    @Column('integer')
    totalAmount: number;

    @Column('varchar')
    currency: string;

    @Column('float')
    latitude: number;

    @Column('float')
    longitude: number;
    
    @OneToOne( () => OrmOrderPayEntity, (pay) => pay.order, { eager: true } )
    @JoinColumn()
    pay?: OrmOrderPayEntity;

    @Column('date', { nullable: true })
    orderReciviedDate?: Date;

    @OneToMany(() => OrmOrderProductEntity, (orderProduct) => orderProduct.order)
    order_products?: OrmOrderProductEntity[];

    @OneToMany(() => OrmOrderBundleEntity, (orderBundle) => orderBundle.order)
    order_bundles?: OrmOrderBundleEntity[]

    static create(
        id: string,
        orderState: string,
        orderCreatedDate: Date,
        totalAmount: number,
        currency: string,
        latitude: number,
        longitude: number,
        pay?: OrmOrderPayEntity,
        orderProducts?: OrmOrderProductEntity[],
        orderBundles?: OrmOrderBundleEntity[],
        orderReciviedDate?: Date,
    ): OrmOrderEntity {
        const order = new OrmOrderEntity();
        order.id = id;
        order.state = orderState;
        order.orderCreatedDate = orderCreatedDate;
        order.totalAmount = totalAmount;
        order.currency = currency;
        order.latitude = latitude;
        order.longitude = longitude;
        order.pay = pay;
        order.order_products = orderProducts;
        order.order_bundles = orderBundles;
        order.orderReciviedDate = orderReciviedDate;
        return order;
    }

}