import { Product } from "src/product/domain/aggregate/product.aggregate";
import { IOdmProduct } from "../../model-entity/odm-model-entity/odm-product-interface";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { ProductID } from "src/product/domain/value-object/product-id";
import { ProductDescription } from "src/product/domain/value-object/product-description";
import { ProductName } from "src/product/domain/value-object/product-name";
import { ProductStock } from "src/product/domain/value-object/product-stock";
import { ProductImage } from "src/product/domain/value-object/product-image";
import { ProductPrice } from "src/product/domain/value-object/product-price";
import { ProductWeigth } from "src/product/domain/value-object/product-weigth";
import { ProductCaducityDate } from "src/product/domain/value-object/product-caducity-date";

export class OdmProductMapper implements IMapper <Product,IOdmProduct>{
    async fromPersistencetoDomain(infraEstructure: IOdmProduct): Promise<Product> {
        return Product.initializeAggregate(
            ProductID.create(infraEstructure.id),
            ProductDescription.create(infraEstructure.description),
            ProductName.create(infraEstructure.name),
            ProductStock.create(infraEstructure.stock),
            infraEstructure.image.map(i=>ProductImage.create(i)),
            ProductPrice.create(infraEstructure.price,infraEstructure.currency),
            ProductWeigth.create(infraEstructure.weigth,infraEstructure.measurament),
            infraEstructure.caducityDate
            ? ProductCaducityDate.create(infraEstructure.caducityDate)
            : null
        )
    }
    async fromDomaintoPersistence(p: Product): Promise<IOdmProduct> {
            return {
                  id: p.getId().Value,
                  name: p.ProductName.Value,
                  description: p.ProductDescription.Value,
                  image: p.ProductImages
                  ? p.ProductImages.map(i=>i.Value)
                  : [],
                  caducityDate: p.ProductCaducityDate
                  ? p.ProductCaducityDate.Value
                  : null,
                  stock: p.ProductStock.Value,
                  price: p.ProductPrice.Price,
                  currency: p.ProductPrice.Currency,
                  weigth: p.ProductWeigth.Weigth,
                  measurament: p.ProductWeigth.Measure,
                  category: [] 
            }
    }
}