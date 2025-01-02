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
import { ProductWeigth } from "src/product/domain/value-object/product-weigth";

export class OrmProductMapper implements IMapper <Product,OrmProductEntity>{

    constructor(
        private readonly idGen:IIdGen<string>
    ){}

    async fromDomaintoPersistence(domainEntity: Product): Promise<OrmProductEntity> {
        let ormImages:OrmProductImage[]=[]
        for (const image of domainEntity.ProductImages){
            ormImages.push(
                OrmProductImage.create(await this.idGen.genId(),image.Value,domainEntity.getId().Value)
            )
        }

        let data:OrmProductEntity={
            id:domainEntity.getId().Value,
            name: domainEntity.ProductName.Value,
            desciption: domainEntity.ProductDescription.Value,
            caducityDate: domainEntity.ProductCaducityDate
            ? domainEntity.ProductCaducityDate.Value
            : null,
            stock: domainEntity.ProductStock.Value,
            images: ormImages,
            price:domainEntity.ProductPrice.Price,
            currency:domainEntity.ProductPrice.Currency,
            weigth:domainEntity.ProductWeigth.Weigth,
            measurament:domainEntity.ProductWeigth.Measure
        }
        return data
    }
    async fromPersistencetoDomain(infraEstructure: OrmProductEntity): Promise<Product> {

        let product=Product.initializeAggregate(
            ProductID.create(infraEstructure.id),
            ProductDescription.create(infraEstructure.desciption),
            ProductName.create(infraEstructure.name),
            ProductStock.create(infraEstructure.stock),
            infraEstructure.images.map((ormimage)=>ProductImage.create(ormimage.image)),
            ProductPrice.create(Number(infraEstructure.price),infraEstructure.currency),
            ProductWeigth.create(infraEstructure.weigth,infraEstructure.measurament),
            infraEstructure.caducityDate
            ?  ProductCaducityDate.create(infraEstructure.caducityDate)
            : null
        )
        return product
    }
}