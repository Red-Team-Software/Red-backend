import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IPaymentMethod } from "../../model-entity/orm-model-entity/orm-payment-method-interface";

@Entity('payment-method')
export class PaymentMethodEntity implements IPaymentMethod {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    state: string;

    @Column()
    imageUrl: string;

    static create(
        id: string,
        name: string, 
        state: string,
        imageUrl: string
    ): PaymentMethodEntity  {
            const paymentMethod = new PaymentMethodEntity();
            paymentMethod.id = id;
            paymentMethod.name = name;
            paymentMethod.state = state;
            paymentMethod.imageUrl = imageUrl;
            return paymentMethod;
        }
}