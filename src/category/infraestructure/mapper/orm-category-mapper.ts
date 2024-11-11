// src/category/infrastructure/mappers/orm-category-mapper.ts

import { IMapper } from "src/common/application/mappers/mapper.interface";
import { Category } from "src/category/domain/aggregate/category";
import { OrmCategoryEntity } from "../entities/orm-entities/orm-category-entity";
import { CategoryId } from "src/category/domain/value-object/category-id";
import { CategoryName } from "src/category/domain/value-object/category-name";
import { ProductID } from "src/product/domain/value-object/product-id";
import { IIdGen } from "src/common/application/id-gen/id-gen.interface";

export class OrmCategoryMapper implements IMapper<Category, OrmCategoryEntity> {
    constructor(private readonly idGen: IIdGen<string>) {}

    async fromDomaintoPersistence(domainEntity: Category): Promise<OrmCategoryEntity> {
        const ormProducts = domainEntity.getProducts().map(
            (productId) => ({ id: productId.Value } as any)
        );

        const data: OrmCategoryEntity = {
            id: domainEntity.getId().Value,
            name: domainEntity.getName(),
            products: ormProducts,
        };
        
        return data;
    }

    async fromPersistencetoDomain(infraEntity: OrmCategoryEntity): Promise<Category> {
        const productIds = infraEntity.products.map(
            (ormProduct) => ProductID.create(ormProduct.id) // Convertimos cada ID de producto
        );

        const category = Category.create(
            CategoryId.create(infraEntity.id),
            CategoryName.create(infraEntity.name),
            productIds // Pasamos solo los ProductID
        );
        
        return category;
    }
}
