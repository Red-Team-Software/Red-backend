import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";
import { OrmOrderEntity } from "./orm-order-entity";
import { OrmCourierEntity } from "src/courier/infraestructure/entities/orm-courier-entity";


@Entity('order_courier')
export class OrmOrderCourierEntity {

    @ManyToOne(() => OrmCourierEntity, (courier) => courier.order_couriers)
    @JoinColumn({ name: 'courier_id' })
    courier: OrmCourierEntity;

    @PrimaryColumn('uuid')
    order_id: string;

    @PrimaryColumn('uuid')
    courier_id: string;

    @Column('numeric')
    latitude: number; 

    @Column('numeric')
    longitude: number;

    static create(
        order: string,
        courier: string,
        latitude: number,
        longitude:number
    ): OrmOrderCourierEntity {
        const orderProduct = new OrmOrderCourierEntity();
        orderProduct.order_id = order;
        orderProduct.courier_id = courier;
        orderProduct.latitude = latitude;
        orderProduct.longitude = longitude;
        return orderProduct;
    }
}