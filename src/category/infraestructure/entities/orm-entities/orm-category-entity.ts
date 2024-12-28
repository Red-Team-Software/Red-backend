import { Entity, Column, PrimaryColumn, ManyToMany, JoinTable, OneToOne, JoinColumn } from "typeorm";
import { OrmProductEntity} from "src/product/infraestructure/entities/orm-entities/orm-product-entity";
import { OrmCategoryImage } from "./orm-category-image.entity";
import { OrmBundleEntity } from "src/bundle/infraestructure/entities/orm-entities/orm-bundle-entity";

@Entity('category')
export class OrmCategoryEntity {
    
    @PrimaryColumn({ type: 'uuid' })
    id: string;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @ManyToMany(() => OrmProductEntity, (product) => product.categories, { eager: true })
    @JoinTable({
        name: "category_product",
        joinColumn: {
            name: "category_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "product_id",
            referencedColumnName: "id"
        }
    })
    products?: OrmProductEntity[];

    @ManyToMany(() => OrmBundleEntity, (bundle) => bundle.categories, { eager: true })
    @JoinTable({
        name: "category_bundle",
        joinColumn: {
            name: "category_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "bundle_id",
            referencedColumnName: "id"
        }
    })
    bundles?: OrmBundleEntity[];

    @OneToOne(() => OrmCategoryImage, (categoryImage) => categoryImage.category, {eager:true ,cascade: true })
    @JoinColumn()
    image: OrmCategoryImage;

    static create(id: string, name: string, image: OrmCategoryImage, products: OrmProductEntity[], bundles: OrmBundleEntity[]): OrmCategoryEntity {
        const category = new OrmCategoryEntity();
        category.id = id;
        category.name = name;
        category.image = image;
        category.products = products;
        category.bundles = bundles;
        return category;
    }
}
