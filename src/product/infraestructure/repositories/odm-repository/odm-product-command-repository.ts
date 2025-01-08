import { Model, Mongoose } from "mongoose";
import { Result } from "src/common/utils/result-handler/result";
import { Product } from "src/product/domain/aggregate/product.aggregate";
import { ICommandProductRepository } from "src/product/domain/repository/product.command.repositry.interface";
import { ProductID } from "src/product/domain/value-object/product-id";
import { OdmProduct, OdmProductSchema } from "../../entities/odm-entities/odm-product-entity";
import { PersistenceException } from "src/common/infraestructure/infraestructure-exception";
import { OdmProductMapper } from "../../mapper/odm-mapper/odm-product-mapper";

export class OdmProductCommandRepository implements ICommandProductRepository {

    private readonly model: Model<OdmProduct>;
    private readonly odmMapper:OdmProductMapper

    constructor( mongoose: Mongoose ) { 
        this.model = mongoose.model<OdmProduct>('OdmProduct', OdmProductSchema)
        this.odmMapper=new OdmProductMapper()
    }
    async createProduct(product: Product): Promise<Result<Product>> {
        try{
            const odm = new this.model(await this.odmMapper.fromDomaintoPersistence(product))
            let e=await this.model.create( odm )
            return Result.success(product)
        }catch(e){
            return Result.fail( new PersistenceException('Create product unsucssessfully') )
        }
    }
    async deleteProductById(id: ProductID): Promise<Result<ProductID>> {
        try{
            const result = await this.model.findOneAndDelete( { id: id.Value } )
            return Result.success(id)
        } catch (e) {
            return Result.fail(new PersistenceException('Delete product unsucssessfully'))
        }    
    }
    async updateProduct(product: Product): Promise<Result<Product>> {
        try{
            const odm = new this.model(await this.odmMapper.fromDomaintoPersistence(product))
            const result = await this.model.updateOne({id:odm.id},odm)
            return Result.success(product)
        } catch (e) {
            return Result.fail(new PersistenceException('Update product unsucssessfully'))
        }    
    }
}