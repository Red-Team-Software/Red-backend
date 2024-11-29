import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { IOrderPaymentInterface } from "../orm-model-entity/order-payment-interface";
import { OrmOrderEntity } from "./orm-order-entity";

@Entity('pay')
export class OrmOrderPayEntity implements IOrderPaymentInterface {
    
    @PrimaryColumn( 'uuid' , { primaryKeyConstraintName: "pay_id" })
    id: string;

    @Column('numeric')
    amount: number;

    @Column('varchar')
    currency: string;

    @Column('varchar')
    paymentMethod: string;

    @JoinColumn( { name: 'order_id'} )
    order: OrmOrderEntity;

    @Column('varchar')
    order_id: string;

    static create(
        id: string,
        amount: number,
        currency: string,
        paymentMethod: string,
        order_id: string
    ): OrmOrderPayEntity {
        const pay = new OrmOrderPayEntity();
        pay.id = id;
        pay.amount = amount;
        pay.currency = currency;
        pay.paymentMethod = paymentMethod;
        pay.order_id = order_id;
        return pay;
    }

}