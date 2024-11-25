import { Column, Entity, OneToMany, OneToOne, PrimaryColumn } from "typeorm"
import { OrmCourierImageEntity } from "./orm-courier-image-entity"
import { ICourierInterface } from "../model-entity/orm-model-entity/courier-interface"


@Entity( { name: 'courier' } )
export class OrmCourierEntity implements ICourierInterface{
    @PrimaryColumn({type:"uuid"}) 
    id:string
    @Column( 'varchar', { unique: true }   ) 
    name: string
    @OneToOne( () => OrmCourierImageEntity,   image => image.courier,{ eager: true }) 
    image: OrmCourierImageEntity   

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