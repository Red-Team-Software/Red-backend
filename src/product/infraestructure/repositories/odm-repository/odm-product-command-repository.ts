import { Model, Mongoose } from "mongoose";
import { Result } from "src/common/utils/result-handler/result";
import { Product } from "src/product/domain/aggregate/product.aggregate";
import { ICommandProductRepository } from "src/product/domain/repository/product.command.repositry.interface";
import { ProductID } from "src/product/domain/value-object/product-id";
import { OdmProduct, OdmProductSchema } from "../../entities/odm-entities/odm-product-entity";
import { PersistenceException } from "src/common/infraestructure/infraestructure-exception";
import { IOdmProduct } from "../../model-entity/odm-model-entity/odm-product-interface";

export class OdmProductCommandRepository implements ICommandProductRepository {

    private readonly model: Model<OdmProduct>;

    trasformToDataModel(p:Product):IOdmProduct{
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

    constructor( mongoose: Mongoose ) { 
        this.model = mongoose.model<OdmProduct>('OdmProduct', OdmProductSchema)
    }
    async createProduct(product: Product): Promise<Result<Product>> {
        try{
            const odm = new this.model(this.trasformToDataModel(product))
            await this.model.create( odm )
            return Result.success(product)
        }catch(e){
            return Result.fail( new PersistenceException('Create product unsucssessfully') )
        }
    }
    deleteProductById(id: ProductID): Promise<Result<ProductID>> {
        throw new Error("Method not implemented.");
    }
    updateProduct(product: Product): Promise<Result<Product>> {
        throw new Error("Method not implemented.");
    }
}