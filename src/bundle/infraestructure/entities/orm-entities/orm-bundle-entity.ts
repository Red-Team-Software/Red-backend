import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn } from "typeorm";
import { IBundle } from "../../model-entity/orm-model-entity/bundle-interface";
import { OrmBundleImage } from "./orm-bundle-image";
import { OrmProductEntity } from "src/product/infraestructure/entities/orm-entities/orm-product-entity";
import { OrmPromotionEntity } from '../../../../promotion/infraestructure/entities/orm-entities/orm-promotion-entity';
import { OrmCategoryEntity } from "src/category/infraestructure/entities/orm-entities/orm-category-entity";
import { OrmOrderBundleEntity } from "src/order/infraestructure/entities/orm-entities/orm-order-bundle-entity";

@Entity('bundle')
export class OrmBundleEntity implements IBundle{

    @PrimaryColumn({type:"uuid"}) id:string
    @Column( 'varchar', { unique: true }   ) name: string
    @Column( 'varchar' ) desciption: string
    @Column( 'timestamp', { nullable:true } ) caducityDate?: Date
    @OneToMany( () => OrmBundleImage,   image => image.bundle,{ eager: true }) images: OrmBundleImage[]   
    @Column( 'integer' ) stock: number
    @Column('numeric') price: number
    @Column( 'varchar' ) currency: string;
    @Column( 'integer' ) weigth: number;
    @Column( 'varchar' ) measurament: string;

    @ManyToMany(() => OrmPromotionEntity, promotion => promotion.bundles, 
    {onDelete:'CASCADE' , onUpdate:'CASCADE'} 
    )   
    promotions?: OrmPromotionEntity[]

    @ManyToMany(()=>OrmProductEntity, {eager:true, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
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

    @ManyToMany(() => OrmCategoryEntity, category => category.bundles,{
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
    })
    categories?: OrmCategoryEntity[];

    @OneToMany(() => OrmOrderBundleEntity, (orderBundle) => orderBundle.bundle, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
    })
    order_bundles?: OrmOrderBundleEntity[]

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
        products: OrmProductEntity[],
        categories: OrmCategoryEntity[]
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
        bundle.categories=categories
        return bundle
    }
}
