import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm"
import { OrmProductEntity } from "./orm-product-entity"
import { IProductImage } from "../../model-entity/orm-model-entity/product-image-interface"

@Entity( { name: 'product_image' } )
export class OrmProductImage implements IProductImage
{
    @PrimaryColumn("uuid", { primaryKeyConstraintName: "pk_product_image_id" })
    id: string
    @Column( 'varchar' ) image: string
    @ManyToOne( () => OrmProductEntity ) @JoinColumn( { name: 'product_id' } ) product: OrmProductEntity
    @Column( 'varchar' ) product_id: string
    static create ( 
        id: string,
        image:string,
        product_id:string
    ): OrmProductImage
    {
        const activityImage = new OrmProductImage()
        activityImage.id=id
        activityImage.image=image
        activityImage.product_id=product_id
        return activityImage
    }

}