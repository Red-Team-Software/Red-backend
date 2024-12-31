import { Entity, PrimaryColumn, Column, OneToMany, JoinTable, ManyToMany } from "typeorm"
import { IOrmModelPromotion } from "../../model-entity/orm-model-entity/promotion-interface"
import { OrmProductEntity } from "src/product/infraestructure/entities/orm-entities/orm-product-entity"
import { OrmBundleEntity } from "src/bundle/infraestructure/entities/orm-entities/orm-bundle-entity"
import { PromotionStateEnum } from "src/promotion/domain/value-object/enum/promotion-state.enum"


@Entity('promotion')
export class OrmPromotionEntity implements IOrmModelPromotion{

    @PrimaryColumn({type:"uuid"}) id:string
    @Column( 'varchar', { unique: true }   ) name: string
    @Column( 'varchar') description: string
    @Column( { type: 'enum', enum: PromotionStateEnum }) state: string
    @Column( 'numeric' ) discount: number

    @ManyToMany(() => OrmProductEntity, product => product.promotions,{eager:true})   
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
    products?: OrmProductEntity[]

    @ManyToMany(() => OrmBundleEntity, bundle => bundle.promotions,{eager:true})   
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
    bundles?: OrmBundleEntity[]

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
        state:string,
        discount:number,
        products: OrmProductEntity[],
        bundles: OrmBundleEntity[]
    ): OrmPromotionEntity
    {
        const promotion = new OrmPromotionEntity()
        promotion.id=id
        promotion.name=name
        promotion.description=description
        promotion.state=state
        promotion.discount=discount
        promotion.products=products
        promotion.bundles=bundles
        return promotion
    }
}