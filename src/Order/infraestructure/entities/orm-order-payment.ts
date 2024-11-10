import { Column, Entity, OneToOne, PrimaryColumn } from "typeorm";
import { IOrderPaymentInterface } from "../orm-model-entity/order-payment-interface";
import { OrmOrderEntity } from "./orm-order-entity";

@Entity('pay')
export class OrmOrderPayEntity implements IOrderPaymentInterface {
    
    @PrimaryColumn({ type: 'uuid' })
    id: string;

    @Column('integer')
    amount: number;

    @Column('varchar')
    currency: string;

    @Column('varchar')
    paymentMethod: string;

    @OneToOne( () => OrmOrderEntity, (order) => order.id)
    order: OrmOrderEntity;

    static create(
        id: string,
        amount: number,
        currency: string,
        paymentMethod: string,
        order: OrmOrderEntity
    ): OrmOrderPayEntity {
        const pay = new OrmOrderPayEntity();
        pay.id = id;
        pay.amount = amount;
        pay.currency = currency;
        pay.paymentMethod = paymentMethod;
        pay.order = order;
        return pay;
    }

}