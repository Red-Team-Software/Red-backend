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
    
    static create ( 
        id: string,
        image:string,
    ): OrmProductImage
    {
        const activityImage = new OrmProductImage()
        activityImage.id=id
        activityImage.image=image
        return activityImage
    }

}