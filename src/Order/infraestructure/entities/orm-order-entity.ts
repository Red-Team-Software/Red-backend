import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { IOrderInterface } from "../orm-model-entity/order-interface";
import { OrmOrderPayEntity } from "./orm-order-payment";

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

    @Column('date')
    orderReciviedDate?: Date;

    @OneToOne( () => OrmOrderPayEntity, (pay) => pay.order, { eager: true } )
    @JoinColumn()
    pay?: OrmOrderPayEntity;

    static create(
        id: string,
        orderState: string,
        orderCreatedDate: Date,
        totalAmount: number,
        currency: string,
        latitude: number,
        longitude: number,
        orderReciviedDate?: Date,
        pay?: OrmOrderPayEntity,
    ): OrmOrderEntity {
        const order = new OrmOrderEntity();
        order.id = id;
        order.state = orderState;
        order.orderCreatedDate = orderCreatedDate;
        order.totalAmount = totalAmount;
        order.currency = currency;
        order.latitude = latitude;
        order.longitude = longitude;
        order.orderReciviedDate = orderReciviedDate;
        order.pay = pay;
        return order;
    }

}