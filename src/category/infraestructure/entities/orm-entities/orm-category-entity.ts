// src/category/infrastructure/entities/orm-entities/orm-category-entity.ts

import { Entity, Column, PrimaryColumn, ManyToMany, JoinTable } from "typeorm";
import { OrmProductEntity } from "src/product/infraestructure/entities/orm-entities/orm-product-entity"

@Entity('category')
export class OrmCategoryEntity {
    
    @PrimaryColumn({ type: 'uuid' })
    id: string;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @ManyToMany(() => OrmProductEntity, (product) => product.categories, { cascade: true })
    @JoinTable({
        name: "category_product", // Nombre de la tabla intermedia
        joinColumn: { name: "category_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "product_id", referencedColumnName: "id" }
    })
    products: OrmProductEntity[];

    static create(id: string, name: string): OrmCategoryEntity {
        const category = new OrmCategoryEntity();
        category.id = id;
        category.name = name;
        return category;
    }
}
