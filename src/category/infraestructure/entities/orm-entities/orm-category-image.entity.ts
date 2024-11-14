import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { OrmCategoryEntity } from "./orm-category-entity";

@Entity({ name: 'category_image' })
export class OrmCategoryImage {
    @PrimaryColumn("uuid", { primaryKeyConstraintName: "pk_category_image_id" })
    id: string;

    @Column('varchar')
    image: string; // URL o ruta de la imagen

    @OneToOne(() => OrmCategoryEntity)
    @JoinColumn({ name: 'category_id' })
    category: OrmCategoryEntity;

    @Column('uuid')
    category_id: string;

    static create(id: string, image: string, category_id: string): OrmCategoryImage {
        const categoryImage = new OrmCategoryImage();
        categoryImage.id = id;
        categoryImage.image = image;
        categoryImage.category_id = category_id;
        return categoryImage;
    }
}