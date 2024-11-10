import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { IOrderInterface } from "../orm-model-entity/order-interface";
import { OrmOrderPayEntity } from "./orm-order-payment";

@Entity('order')
export class OrmOrderEntity implements IOrderInterface {
    
    @PrimaryColumn({ type: 'uuid' })
    id: string;

    @Column('date')
    orderCreatedDate: Date;

    @Column('date')
    orderReciviedDate?: Date;

    @Column('integer')
    totalAmount: number;

    @Column('string')
    direction: string;

    @OneToOne( () => OrmOrderPayEntity, (pay) => pay.id)
    @JoinColumn()
    pay?: OrmOrderPayEntity;

    static create(
        id: string,
        orderCreatedDate: Date,
        totalAmount: number,
        pay?: OrmOrderPayEntity,
        orderReciviedDate?: Date
    ): OrmOrderEntity {
        const order = new OrmOrderEntity();
        order.id = id;
        order.orderCreatedDate = orderCreatedDate;
        order.totalAmount = totalAmount;
        order.pay = pay;
        order.orderReciviedDate = orderReciviedDate;
        return order;
    }

}