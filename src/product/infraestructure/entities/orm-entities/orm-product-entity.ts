import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { IProduct } from "../../model-entity/orm-model-entity/product-interface";
import { OrmProductImage } from "./orm-product-image";

@Entity('product')
export class OrmProductEntity implements IProduct{
    @PrimaryColumn({type:"uuid"}) id:string
    @Column( 'varchar', { unique: true }   ) name: string
    @Column( 'varchar' ) desciption: string
    @Column( 'timestamp', { default: () => 'CURRENT_TIMESTAMP' } ) caducityDate: Date
    @OneToMany( () => OrmProductImage,   image => image.product,{ eager: true }) images: OrmProductImage[]   
    @Column( 'integer' ) stock: number

    static create ( 
        id:string,
        name: string,
        desciption: string,
        caducityDate: Date,
        stock: number
    ): OrmProductEntity
    {
        const user = new OrmProductEntity()
        user.id=id
        user.name=name
        user.desciption=desciption
        user.caducityDate=caducityDate
        user.stock=stock
        return user
    }
}