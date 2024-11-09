import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn } from "typeorm";
import { IBundle } from "../../model-entity/orm-model-entity/bundle-interface";
import { OrmBundleImage } from "./orm-bundle-image";
import { OrmProductEntity } from "src/product/infraestructure/entities/orm-entities/orm-product-entity";

@Entity('bundle')
export class OrmBundleEntity implements IBundle{

    @PrimaryColumn({type:"uuid"}) id:string
    @Column( 'varchar', { unique: true }   ) name: string
    @Column( 'varchar' ) desciption: string
    @Column( 'timestamp', { default: () => 'CURRENT_TIMESTAMP' } ) caducityDate: Date
    @OneToMany( () => OrmBundleImage,   image => image.bundle,{ eager: true }) images: OrmBundleImage[]   
    @Column( 'integer' ) stock: number
    @Column( 'integer' ) price: number
    @Column( 'varchar' ) currency: string;
    @Column( 'integer' ) weigth: number;
    @Column( 'varchar' ) measurament: string;
    @ManyToMany(()=>OrmProductEntity, {eager:true})
    @JoinTable({
        name: "bundle_product",
        joinColumn: {
            name: "bundle_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "product_id",
            referencedColumnName: "id"
        }
    })
    products: OrmProductEntity[];

    static create ( 
        id:string,
        name: string,
        desciption: string,
        caducityDate: Date,
        stock: number,
        price: number,
        images:OrmBundleImage[],
        currency:string,
        weigth:number,
        measurament:string,
        products: OrmProductEntity[]
    ): OrmBundleEntity
    {
        const bundle = new OrmBundleEntity()
        bundle.id=id
        bundle.name=name
        bundle.desciption=desciption
        bundle.caducityDate=caducityDate
        bundle.stock=stock
        bundle.price=price
        bundle.images=images
        bundle.currency=currency
        bundle.weigth=weigth
        bundle.measurament=measurament
        bundle.products=products
        return bundle
    }
}