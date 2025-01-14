import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm"
import { ICourierImage } from "../../model-entity/orm-model-entity/courier-image-interface"
import { OrmCourierEntity } from "./orm-courier-entity"


@Entity( { name: 'courier_image' } )
export class OrmCourierImageEntity implements ICourierImage{
    @PrimaryColumn("uuid")
    id: string

    @Column( 'varchar' ) 
    image: string
    
    @JoinColumn( { name: 'courier_id' } )
    courier: OrmCourierEntity

    @Column( 'varchar' ) 
    courier_id: string


    static create ( 
        id: string,
        image:string,
        courier_id:string
    ): OrmCourierImageEntity
    {
        const activityImage = new OrmCourierImageEntity()
        activityImage.id=id
        activityImage.image=image
        activityImage.courier_id=courier_id
        return activityImage
    }

}