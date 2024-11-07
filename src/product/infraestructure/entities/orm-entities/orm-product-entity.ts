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
    @Column( 'integer' ) price: number

    static create ( 
        id:string,
        name: string,
        desciption: string,
        caducityDate: Date,
        stock: number,
        price: number,
        images:OrmProductImage[],
    ): OrmProductEntity
    {
        const product = new OrmProductEntity()
        product.id=id
        product.name=name
        product.desciption=desciption
        product.caducityDate=caducityDate
        product.stock=stock
        product.price=price
        product.images=images
        return product
    }
}