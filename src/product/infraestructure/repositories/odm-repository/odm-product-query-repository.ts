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
import { OdmPromotionEntity, OdmPromotionSchema } from 'src/promotion/infraestructure/entities/odm-entities/odm-promotion-entity';

export class OdmProductQueryRepository implements IQueryProductRepository {

    private readonly model: Model<OdmProduct>;
    private readonly promotionmodel:Model<OdmPromotionEntity>
    private readonly odmMapper:OdmProductMapper

        private async trasnformtoDataModel(odmProduct:OdmProduct):Promise<IProductModel>{

            const promotions = await this.promotionmodel.find({
                products: { $elemMatch: { id: odmProduct.id } }
            }).exec();
            return {
                id:odmProduct.id,
                description:odmProduct.description,
                caducityDate:
                odmProduct.caducityDate
                ? odmProduct.caducityDate
                : null,	
                name:odmProduct.name,
                stock:odmProduct.stock,
                images:odmProduct.image,
                price:Number(odmProduct.price),
                currency:odmProduct.currency,
                weigth:odmProduct.weigth,
                measurement:odmProduct.measurament,
                categories: odmProduct.category
                ? odmProduct.category.map(c=>({
                    id:c.id,
                    name:c.name
                }))
                : [],
                promotion: promotions
                ? promotions.map(p=>({
                    id:p.id,
                    name:p.name,
                    discount:p.discount
                }))
                : []
                // odmProduct.promotions
                // ? odmProduct.promotions.map(promotion=>({
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
        this.promotionmodel=mongoose.model<OdmPromotionEntity>('odmpromotion',OdmPromotionSchema)
    }

    async findAllProducts(criteria: FindAllProductsApplicationRequestDTO): Promise<Result<IProductModel[]>> {
        try {
            const query: any = {};
            let model:IProductModel[]=[]

            if (criteria.name) 
                query.name = { $regex: criteria.name, $options: 'i' }

            if (criteria.category && criteria.category.length > 0) 
                query.category = { $elemMatch: { name: { $in: criteria.category.map((c: string) => new RegExp(c, 'i')) } } };

            if (criteria.price)
                query.price = { ...query.price, $gte: criteria.price }

            const products = await this.model.find(query)
            .skip(criteria.page)
            .limit(criteria.perPage)
            .exec()

            for (const p of products){
                model.push(await this.trasnformtoDataModel(p))
            }

            if (criteria.discount){
                model=model.filter(p=>p.promotion.length!==0)
            }


            return Result.success(model)
        
        } catch (error) {
            console.log(error)
            return Result.fail(error.message);
        }
    }
    async findAllProductsByName(criteria: FindAllProductsbyNameApplicationRequestDTO): Promise<Result<Product[]>> {
        try{
            let product=await this.model.find({name:criteria.name})
            if(!product)
                return Result.fail( new NotFoundException('Find product unsucssessfully'))
            return Result.success(
                product
                ? await Promise.all(product.map(async p => await this.odmMapper.fromPersistencetoDomain(p)))
                : []
            )
        }
        catch(e){
            return Result.fail( new NotFoundException('Find product unsucssessfully'))
        }    }
    async findProductById(id: ProductID): Promise<Result<Product>> {
        try{
            let product=await this.model.findOne({id:id.Value})
            if(!product)
                return Result.fail( new NotFoundException('Find product unsucssessfully'))
            return Result.success(await this.odmMapper.fromPersistencetoDomain(product))
        }
        catch(e){
            return Result.fail( new NotFoundException('Find product unsucssessfully'))
        }
    }
    async findProductWithMoreDetailById(id: ProductID): Promise<Result<IProductModel>> {
        try{
            let product=await this.model.findOne({id:id.Value})
            if(!product)
                return Result.fail( new NotFoundException('Find product unsucssessfully'))
            return Result.success(await this.trasnformtoDataModel(product))
        }
        catch(e){
            return Result.fail( new NotFoundException('Find product unsucssessfully'))
        }    
    }
    async findProductByName(productName: ProductName): Promise<Result<Product[]>> {
        try{
            let product=await this.model.find({name:productName.Value})
            
            if(!product)
                return Result.fail( new NotFoundException('Find product unsucssessfully'))
            
            return Result.success(
                product
                    ? await Promise.all(product.map(async p => await this.odmMapper.fromPersistencetoDomain(p)))
                    : []
            )
        }
        catch(e){
            return Result.fail( new NotFoundException('Find product unsucssessfully'))
        }
    }
    async verifyProductExistenceByName(productName: ProductName): Promise<Result<boolean>> {
        try{
            let product=await this.model.findOne({name:productName.Value}) 
            console.log(product)
            if(!product)
                return Result.success(false)
            return Result.success(true)
        }
        catch(e){
            return Result.fail( new NotFoundException('Find product unsucssessfully'))
        }
    }

}