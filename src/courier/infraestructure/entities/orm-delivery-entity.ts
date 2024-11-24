import { Column, Entity, OneToMany, OneToOne, PrimaryColumn } from "typeorm"
import { OrmDeliveryImageEntity } from "./orm-delivery-image-entity"
import { IDeliveryInterface } from "../model-entity/orm-model-entity/delivery-interface"


@Entity( { name: 'delivery' } )
export class OrmDeliveryEntity implements IDeliveryInterface{
    @PrimaryColumn({type:"uuid"}) 
    id:string
    @Column( 'varchar', { unique: true }   ) 
    name: string
    @OneToOne( () => OrmDeliveryImageEntity,   image => image.delivery,{ eager: true }) 
    image: OrmDeliveryImageEntity   

    static create ( 
        id:string,
        name: string,
        images:OrmDeliveryImageEntity,
    ): OrmDeliveryEntity
    {
        const delivery = new OrmDeliveryEntity()
        delivery.id = id
        delivery.name = name
        delivery.image = images
        return delivery
    }
}