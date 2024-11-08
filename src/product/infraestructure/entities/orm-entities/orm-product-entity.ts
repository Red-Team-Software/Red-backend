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
    @Column( 'varchar' ) currency: string;
    @Column( 'integer' ) weigth: number;
    @Column( 'varchar' ) measurament: string;

    static create ( 
        id:string,
        name: string,
        desciption: string,
        caducityDate: Date,
        stock: number,
        price: number,
        images:OrmProductImage[],
        currency:string,
        weigth:number,
        measurament:string,
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
        product.currency=currency
        product.weigth=weigth
        product.measurament=measurament
        return product
    }
}