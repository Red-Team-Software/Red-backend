import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm"
import { IDeliveryImage } from "../model-entity/orm-model-entity/delivery-image-interface"
import { OrmDeliveryEntity } from "./orm-delivery-entity"


@Entity( { name: 'delivery_image' } )
export class OrmDeliveryImageEntity implements IDeliveryImage
{
    @PrimaryColumn("uuid")
    id: string

    @Column( 'varchar' ) 
    image: string
    
    @JoinColumn( { name: 'delivery_id' } )
    delivery: OrmDeliveryEntity

    @Column( 'varchar' ) 
    delivery_id: string


    static create ( 
        id: string,
        image:string,
        delivery_id:string
    ): OrmDeliveryImageEntity
    {
        const activityImage = new OrmDeliveryImageEntity()
        activityImage.id=id
        activityImage.image=image
        activityImage.delivery_id=delivery_id
        return activityImage
    }

}