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
import { OdmProduct } from "src/product/infraestructure/entities/odm-entities/odm-product-entity";
import { IProductModel } from "src/product/application/model/product.model.interface";
import { NotFoundException } from "src/common/infraestructure/infraestructure-exception";
import { OdmBundleMapper } from "../../mapper/odm-mapper/odm-bundle-mapper";


export class OdmBundleQueryRepository implements IQueryBundleRepository{

    private readonly model: Model<OdmBundle>;
    private readonly odmMapper: OdmBundleMapper

    constructor( mongoose: Mongoose ) { 
        this.model = mongoose.model<OdmBundle>('OdmBundle', OdmBundleSchema)
        this.odmMapper= new OdmBundleMapper()
    }

        private trasnformtoDataModel(odm:OdmBundle):IBundleModel{
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
                promotion: [],
                // odm.promotions
                // ? odm.promotions.map(promotion=>({
                //     id:promotion.id,
                //     name:promotion.name,
                //     discount:Number(promotion.discount)
                // }))
                // : []
                products: odm.products
                ? odm.products.map(p=>({
                    id:p.id,
                    name:p.name
                }))
                : []
            }
        }
    


    async findAllBundles(criteria: FindAllBundlesApplicationRequestDTO): Promise<Result<IBundleModel[]>> {
        try {
            const query: any = {};

            if (criteria.name) 
                query.name = { $regex: criteria.name, $options: 'i' }

            if (criteria.category) 
                query.category = { $elemMatch: { name: { $in: criteria.category } } };

            if (criteria.price)
                query.price = { ...query.price, $gte: criteria.price }

            if (criteria.discount)
                query.discount = { $gt: 0 };

            const bundles = await this.model.find(query).exec()

            return Result.success(bundles
                ? bundles.map(p=>this.trasnformtoDataModel(p))
                : []
            )
        
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
            console.log(error)
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
            return Result.success(this.trasnformtoDataModel(odm))
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