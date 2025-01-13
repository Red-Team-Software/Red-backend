import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from "typeorm"
import { OrmCourierImageEntity } from "./orm-courier-image-entity"
import { ICourierInterface } from "../model-entity/orm-model-entity/courier-interface"
import { OrmOrderEntity } from "src/order/infraestructure/entities/orm-entities/orm-order-entity";


@Entity( 'courier' )
export class OrmCourierEntity implements ICourierInterface{
    @PrimaryColumn({type:"uuid"}) 
    id:string;
    @Column( 'varchar', { unique: true }   ) 
    name: string;

    @OneToOne( () => OrmCourierImageEntity,   image => image.courier,{ cascade: true, eager: true } ) 
    @JoinColumn()
    image: OrmCourierImageEntity;

    @OneToMany( () => OrmOrderEntity, orders => orders.order_courier, {nullable: true} )
    orders?: OrmOrderEntity[];

    @Column('float')
    latitude: number;

    @Column('float')
    longitude: number;

    static create ( 
        id:string,
        name: string,
        images:OrmCourierImageEntity,
        lat: number,
        long: number
    ): OrmCourierEntity {
        const courier = new OrmCourierEntity();
        courier.id = id;
        courier.name = name;
        courier.image = images;
        courier.latitude = lat;
        courier.longitude = long;
        return courier;
    }
}