import { Entity, PrimaryColumn, Column, OneToMany, JoinTable, ManyToMany } from "typeorm"
import { IOrmModelPromotion } from "../../model-entity/orm-model-entity/promotion-interface"
import { OrmProductEntity } from "src/product/infraestructure/entities/orm-entities/orm-product-entity"
import { OrmBundleEntity } from "src/bundle/infraestructure/entities/orm-entities/orm-bundle-entity"


@Entity('promotion')
export class OrmPromotionEntity implements IOrmModelPromotion{

    @PrimaryColumn({type:"uuid"}) id:string
    @Column( 'varchar', { unique: true }   ) name: string
    @Column( 'varchar') description: string
    @Column( 'boolean') avaleableState: boolean
    @Column( 'numeric' ) discount: number

    @ManyToMany(()=>OrmProductEntity, {eager:true})
    @JoinTable({
        name: "promotion_product",
        joinColumn: {
            name: "promotion_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "product_id",
            referencedColumnName: "id"
        }
    })
    products: OrmProductEntity[]


    @ManyToMany(()=>OrmBundleEntity, {eager:true})
    @JoinTable({
        name: "promotion_bundle",
        joinColumn: {
            name: "promotion_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "bundle_id",
            referencedColumnName: "id"
        }
    })
    bundles: OrmBundleEntity[]

    // TODO Categories 
    // @ManyToMany(()=>, {eager:true})
    // @JoinTable({
    //     name: "promotion_bundle",
    //     joinColumn: {
    //         name: "promotion_id",
    //         referencedColumnName: "id"
    //     },
    //     inverseJoinColumn: {
    //         name: "bundle_id",
    //         referencedColumnName: "id"
    //     }
    // })
    // bundles: OrmBundleEntity[]

    static create ( 
        id:string,
        description:string,
        name:string,
        avaleableState:boolean,
        discount:number,
        products: OrmProductEntity[],
        bundles: OrmBundleEntity[]
    ): OrmPromotionEntity
    {
        const promotion = new OrmPromotionEntity()
        promotion.id=id
        promotion.name=name
        promotion.description=description
        promotion.avaleableState=avaleableState
        promotion.discount=discount
        promotion.products=products
        promotion.bundles=bundles
        return promotion
    }
}