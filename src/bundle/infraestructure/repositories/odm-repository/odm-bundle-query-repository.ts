import { FindAllBundlesApplicationRequestDTO } from "src/bundle/application/dto/request/find-all-bundles-application-request-dto";
import { FindAllBundlesbyNameApplicationRequestDTO } from "src/bundle/application/dto/request/find-all-bundles-by-name-application-request-dto";
import { IBundleModel } from "src/bundle/application/model/bundle.model.interface";
import { IQueryBundleRepository } from "src/bundle/application/query-repository/query-bundle-repository";
import { Bundle } from "src/bundle/domain/aggregate/bundle.aggregate";
import { BundleId } from "src/bundle/domain/value-object/bundle-id";
import { BundleName } from "src/bundle/domain/value-object/bundle-name";
import { Result } from "src/common/utils/result-handler/result";
import { OdmBundle, OdmBundleSchema } from "../../entities/odm-entities/odm-bundle-entity";
import { Model, Mongoose } from "mongoose";
import { OdmProductMapper } from "src/product/infraestructure/mapper/odm-mapper/odm-product-mapper";
import { OdmProduct, OdmProductSchema } from "src/product/infraestructure/entities/odm-entities/odm-product-entity";
import { IProductModel } from "src/product/application/model/product.model.interface";
import { NotFoundException } from "src/common/infraestructure/infraestructure-exception";
import { OdmBundleMapper } from "../../mapper/odm-mapper/odm-bundle-mapper";
import { OdmPromotionEntity, OdmPromotionSchema } from "src/promotion/infraestructure/entities/odm-entities/odm-promotion-entity";
import { IPromotion } from "src/promotion/application/model/promotion.interface";
import { IOdmModelPromotion } from "src/promotion/infraestructure/model-entity/odm-model-entity/odm-promotion-interface";


export class OdmBundleQueryRepository implements IQueryBundleRepository{

    private readonly model: Model<OdmBundle>;
    private readonly promotionmodel: Model<OdmPromotionEntity>;
    private readonly productmodel: Model<OdmProduct>;
    private readonly odmMapper: OdmBundleMapper

    constructor( mongoose: Mongoose ) { 
        this.model = mongoose.model<OdmBundle>('odmbundle', OdmBundleSchema)
        this.promotionmodel=mongoose.model<OdmPromotionEntity>('odmpromotion',OdmPromotionSchema)
        this.productmodel=mongoose.model<OdmProduct>('odmproduct',OdmProductSchema)
        this.odmMapper= new OdmBundleMapper()
    }

        private async trasnformtoDataModel(odm:OdmBundle):Promise<IBundleModel>{

            const promotions = await this.promotionmodel.find({
                bundles: { $elemMatch: { id: odm.id } }
            }).exec();

            const productIds = odm.products.map(product => product.id);
            const products = await this.productmodel.find({ id: { $in: productIds } }).exec();

            return {
                id:odm.id,
                description:odm.description,
                caducityDate:
                odm.caducityDate
                ? odm.caducityDate
                : null,	
                name:odm.name,
                stock:odm.stock,
                images:odm.image,
                price:Number(odm.price),
                currency:odm.currency,
                weigth:odm.weigth,
                measurement:odm.measurament,
                categories: odm.category
                ? odm.category.map(c=>({
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
                : [],
                products: products
                ? products.map(p=>({
                    id:p.id,
                    name:p.name,
                    price: p.price,
                    weight: p.weigth,
                    images: p.image,
                    quantity: p.stock
                }))
                : []
            }
        }
    


    async findAllBundles(criteria: FindAllBundlesApplicationRequestDTO): Promise<Result<IBundleModel[]>> {
        try {
            let query: any = {};

            let model:IBundleModel[]=[]

            if (criteria.name) 
                query.name = { $regex: criteria.name, $options: 'i' }

            if (criteria.category) 
                query.category = { $elemMatch: { name: { $in: criteria.category.map((c: string) => new RegExp(c, 'i')) } } };

            if (criteria.price)
                query.price = { ...query.price, $lt: criteria.price }

            if (criteria.popular) {
                // query = { 
                //     ...query, 
                //     $lookup: { 
                //         from: "odmorders", 
                //         localField: "id", 
                //         foreignField: "product_details.id", 
                //         as: "order_details",
                //      }, 
                //     $addFields: { "order_details.count": { $size: "$order_details" }, },
                //     $sort: { "order_details.count": -1 }
                // };
            }

            const bundles = await this.model.find(query)
            
            .skip(criteria.page)
            .limit(criteria.perPage)
            .exec()

            for (const b of bundles){
                model.push(await this.trasnformtoDataModel(b))
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
    async findAllBundlesByName(criteria: FindAllBundlesbyNameApplicationRequestDTO): Promise<Result<Bundle[]>> {
        try {
            const query: any = {};

            if (criteria.name) 
                query.name = { $regex: criteria.name, $options: 'i' }

            const bundles = await this.model.find(query).exec()

            return Result.success(bundles
                ? await Promise.all(bundles.map(async p => await this.odmMapper.fromPersistencetoDomain(p)))
                : []
            )
        
        } catch (error) {
            return Result.fail(error.message);
        }
    }
    async findBundleById(id: BundleId): Promise<Result<Bundle>> {
        try{
            let odm=await this.model.findOne({id:id.Value})
            if(!odm)
                return Result.fail( new NotFoundException('Find bundle unsucssessfully'))
            return Result.success(await this.odmMapper.fromPersistencetoDomain(odm))
        }
        catch(e){
            return Result.fail( new NotFoundException('Find bundle unsucssessfully'))
        }
    }
    async findBundleWithMoreDetailById(id: BundleId): Promise<Result<IBundleModel>> {
        try{
            let odm=await this.model.findOne({id:id.Value})
            if(!odm)
                return Result.fail( new NotFoundException('Find bundle unsucssessfully'))
            return Result.success(await this.trasnformtoDataModel(odm))
        }
        catch(e){
            return Result.fail( new NotFoundException('Find bundle unsucssessfully'))
        } 
    }
    async findBundleByName(bundleName: BundleName): Promise<Result<Bundle[]>> {
        try{
            let odm=await this.model.find({name:bundleName.Value})
            
            if(!odm)
                return Result.fail( new NotFoundException('Find bundle unsucssessfully'))
            
            return Result.success(
                odm
                    ? await Promise.all(odm.map(async p => await this.odmMapper.fromPersistencetoDomain(p)))
                    : []
            )
        }
        catch(e){
            return Result.fail( new NotFoundException('Find bundle unsucssessfully'))
        }
    }
    async verifyBundleExistenceByName(bundleName: BundleName): Promise<Result<boolean>> {
        try{
            let odm=await this.model.findOne({name:bundleName.Value}) 
            if(!odm)
                return Result.success(false)
            return Result.success(true)
        }
        catch(e){
            return Result.fail( new NotFoundException('Find bundle unsucssessfully'))
        }
    }
}