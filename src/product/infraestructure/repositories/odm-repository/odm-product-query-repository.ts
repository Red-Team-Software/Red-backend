import { Model, Mongoose } from 'mongoose';
import { Result } from 'src/common/utils/result-handler/result';
import { FindAllProductsbyNameApplicationRequestDTO } from 'src/product/application/dto/request/find-all-products-and-combos-application-request-dto';
import { FindAllProductsApplicationRequestDTO } from 'src/product/application/dto/request/find-all-products-application-request-dto';
import { IProductModel } from 'src/product/application/model/product.model.interface';
import { IQueryProductRepository } from 'src/product/application/query-repository/query-product-repository';
import { ProductID } from 'src/product/domain/value-object/product-id';
import { ProductName } from 'src/product/domain/value-object/product-name';
import { OdmProduct, OdmProductSchema } from '../../entities/odm-entities/odm-product-entity';
import { Product } from 'src/product/domain/aggregate/product.aggregate';
import { NotFoundException } from 'src/common/infraestructure/infraestructure-exception';
import { OdmProductMapper } from '../../mapper/odm-mapper/odm-product-mapper';

export class OdmProductQueryRepository implements IQueryProductRepository {

    private readonly model: Model<OdmProduct>;
    private readonly odmMapper:OdmProductMapper

        private trasnformtoDataModel(ormProduct:OdmProduct):IProductModel{
            return {
                id:ormProduct.id,
                description:ormProduct.description,
                caducityDate:
                ormProduct.caducityDate
                ? ormProduct.caducityDate
                : null,	
                name:ormProduct.name,
                stock:ormProduct.stock,
                images:ormProduct.image,
                price:Number(ormProduct.price),
                currency:ormProduct.currency,
                weigth:ormProduct.weigth,
                measurement:ormProduct.measurament,
                categories: ormProduct.category
                ? ormProduct.category.map(c=>({
                    id:c.id,
                    name:c.name
                }))
                : [],
                promotion: []
                // ormProduct.promotions
                // ? ormProduct.promotions.map(promotion=>({
                //     id:promotion.id,
                //     name:promotion.name,
                //     discount:Number(promotion.discount)
                // }))
                // : []
            }
        }


    constructor( mongoose: Mongoose ) { 
        this.model = mongoose.model<OdmProduct>('OdmProduct', OdmProductSchema)
        this.odmMapper=new OdmProductMapper()
    }

    findAllProducts(criteria: FindAllProductsApplicationRequestDTO): Promise<Result<IProductModel[]>> {
        throw new Error('Method not implemented.');
    }
    findAllProductsByName(criteria: FindAllProductsbyNameApplicationRequestDTO): Promise<Result<Product[]>> {
        throw new Error('Method not implemented.');
    }
    async findProductById(id: ProductID): Promise<Result<Product>> {
        try{
            let product=await this.model.findById({id:id.Value})
            if(!product)
                return Result.fail( new NotFoundException('Find product unsucssessfully'))
            return Result.success(await this.odmMapper.fromPersistencetoDomain(product))
        }
        catch(e){
            return Result.fail( new NotFoundException('Find product unsucssessfully'))
        }
    }
    findProductWithMoreDetailById(id: ProductID): Promise<Result<IProductModel>> {
        throw new Error('Method not implemented.');
    }
    findProductByName(productName: ProductName): Promise<Result<Product[]>> {
        throw new Error('Method not implemented.');
    }
    verifyProductExistenceByName(productName: ProductName): Promise<Result<boolean>> {
        throw new Error('Method not implemented.');
    }

}