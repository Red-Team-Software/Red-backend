import { Category } from "src/category/domain/aggregate/category.aggregate";
import { CategoryID } from "src/category/domain/value-object/category-id";
import { CategoryImage } from "src/category/domain/value-object/category-image";
import { CategoryName } from "src/category/domain/value-object/category-name";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { ProductID } from "src/product/domain/value-object/product-id";
import { OdmCategory } from "../../entities/odm-entities/odm-category.entity";
import { BundleId } from "src/bundle/domain/value-object/bundle-id";

export class OdmCategoryMapper implements IMapper<Category, OdmCategory> {

    constructor() {}

    async fromDomaintoPersistence(domainEntity: Category): Promise<OdmCategory> {
        throw new Error('method not avaleable')
    }

    async fromPersistencetoDomain(infraEntity: OdmCategory): Promise<Category> {
        const category = Category.initializeAggregate(
            CategoryID.create(infraEntity.id),
            CategoryName.create(infraEntity.name),
            CategoryImage.create(infraEntity.image),
            infraEntity.products
            ? infraEntity.products.map(id=>ProductID.create(id.id))
            : [],
            infraEntity.bundles
            ? infraEntity.bundles.map(b=>BundleId.create(b.id))
            : []
        );

        return category;
    }
}
