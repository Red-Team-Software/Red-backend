import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm"
import { IBundleImage } from "../../model-entity/orm-model-entity/bundle-image-interface"
import { OrmBundleEntity } from "./orm-bundle-entity"

@Entity( { name: 'bundle_image' } )
export class OrmBundleImage implements IBundleImage
{
    @PrimaryColumn("uuid", { primaryKeyConstraintName: "pk_bundle_image_id" })
    id: string
    @Column( 'varchar' ) image: string
    @ManyToOne( () => OrmBundleEntity, { onDelete: 'CASCADE',   onUpdate: 'CASCADE'} ) 
    @JoinColumn( { name: 'bundle_id' }) bundle: OrmBundleEntity
    @Column( 'varchar' ) bundle_id: string
    static create ( 
        id: string,
        image:string,
        bundle_id:string
    ): OrmBundleImage
    {
        const activityImage = new OrmBundleImage()
        activityImage.id=id
        activityImage.image=image
        activityImage.bundle_id=bundle_id
        return activityImage
    }

}