import { Entity, Column, PrimaryColumn, ManyToMany, JoinTable, OneToOne, JoinColumn } from "typeorm";
import { OrmProductEntity} from "src/product/infraestructure/entities/orm-entities/orm-product-entity";
import { OrmCategoryImage } from "./orm-category-image.entity";
@Entity('category')
export class OrmCategoryEntity {
    
    @PrimaryColumn({ type: 'uuid' })
    id: string;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @ManyToMany(() => OrmProductEntity, (product) => product.categories, { cascade: true })
    @JoinTable()
    products: OrmProductEntity[];

    @OneToOne(() => OrmCategoryImage, (categoryImage) => categoryImage.category, { cascade: true })
    @JoinColumn()
    image: OrmCategoryImage;

    static create(id: string, name: string): OrmCategoryEntity {
        const category = new OrmCategoryEntity();
        category.id = id;
        category.name = name;
        return category;
    }
}
