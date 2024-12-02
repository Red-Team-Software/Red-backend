import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from "typeorm"
import { OrmCourierImageEntity } from "./orm-courier-image-entity"
import { ICourierInterface } from "../model-entity/orm-model-entity/courier-interface"
import { OrmOrderCourierEntity } from "src/order/infraestructure/entities/orm-order-courier-entity"


@Entity( 'courier' )
export class OrmCourierEntity implements ICourierInterface{
    @PrimaryColumn({type:"uuid"}) 
    id:string
    @Column( 'varchar', { unique: true }   ) 
    name: string

    @OneToOne( () => OrmCourierImageEntity,   image => image.courier,{ cascade: true, eager: true } ) 
    @JoinColumn()
    image: OrmCourierImageEntity   

    @OneToMany( () => OrmOrderCourierEntity, order_couriers => order_couriers.courier )
    order_couriers?: OrmOrderCourierEntity[]

    static create ( 
        id:string,
        name: string,
        images:OrmCourierImageEntity,
    ): OrmCourierEntity {
        const courier = new OrmCourierEntity()
        courier.id = id
        courier.name = name
        courier.image = images
        return courier
    }
}