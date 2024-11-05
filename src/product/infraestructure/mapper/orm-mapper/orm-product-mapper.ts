import { IMapper } from "src/common/application/mappers/mapper.interface";
import { Product } from "src/product/domain/aggregate/product.aggregate";
import { OrmProductEntity } from "../../entities/orm-entities/orm-product-entity";
import { ProductID } from "src/product/domain/value-object/product-id";
import { ProductDescription } from "src/product/domain/value-object/product-description";
import { ProductCaducityDate } from "src/product/domain/value-object/product-caducity-date";
import { ProductName } from "src/product/domain/value-object/product-name";
import { ProductStock } from "src/product/domain/value-object/product-stock";
import { ProductImage } from "src/product/domain/value-object/product-image";
import { OrmProductImage } from "../../entities/orm-entities/orm-product-image";
import { IIdGen } from "src/common/application/id-gen/id-gen.interface";
import { ProductPrice } from "src/product/domain/value-object/product-price";

export class OrmProductMapper implements IMapper <Product,OrmProductEntity>{

    constructor(
        private readonly idGen:IIdGen<string>
    ){}

    async fromDomaintoPersistence(domainEntity: Product): Promise<OrmProductEntity> {
        let id=await this.idGen.genId()
        let data:OrmProductEntity={
            id:domainEntity.getId().Value,
            name: domainEntity.ProductName.Value,
            desciption: domainEntity.ProductDescription.Value,
            caducityDate: domainEntity.ProductCaducityDate.Value,
            stock: domainEntity.ProductStock.Value,
            images:domainEntity.ProductImages.map((productImage)=>OrmProductImage.create(id,productImage.Value)),
            price:domainEntity.ProductPrice.Value
        }
        return data
    }
    async fromPersistencetoDomain(infraEstructure: OrmProductEntity): Promise<Product> {

        let product=Product.initializeAggregate(
            ProductID.create(infraEstructure.id),
            ProductDescription.create(infraEstructure.desciption),
            ProductCaducityDate.create(infraEstructure.caducityDate),
            ProductName.create(infraEstructure.name),
            ProductStock.create(infraEstructure.stock),
            infraEstructure.images.map((ormimage)=>ProductImage.create(ormimage.image)),
            ProductPrice.create(infraEstructure.price)
        )
        return product
    }
}