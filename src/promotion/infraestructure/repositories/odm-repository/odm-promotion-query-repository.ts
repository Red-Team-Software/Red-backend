import { Result } from "src/common/utils/result-handler/result";
import { OdmPromotionEntity, OdmPromotionSchema } from "../../entities/odm-entities/odm-promotion-entity";
import { NotFoundException } from "src/common/infraestructure/infraestructure-exception";
import { OdmBundle, OdmBundleSchema } from "src/bundle/infraestructure/entities/odm-entities/odm-bundle-entity";
import { Model, Mongoose } from "mongoose";
import { IQueryPromotionRepository } from "src/promotion/application/query-repository/promotion.query.repository.interface";
import { FindAllPromotionApplicationRequestDTO } from "src/promotion/application/dto/request/find-all-promotion-application-request-dto";
import { IPromotion } from "src/promotion/application/model/promotion.interface";
import { Promotion } from "src/promotion/domain/aggregate/promotion.aggregate";
import { PromotionId } from "src/promotion/domain/value-object/promotion-id";
import { PromotionName } from "src/promotion/domain/value-object/promotion-name";
import { OdmPromotionMapper } from "../../mapper/odm-mapper/odm-promotion-mapper";


export class OdmPromotionQueryRepository implements IQueryPromotionRepository{

    private readonly model: Model<OdmPromotionEntity>;
    private readonly odmMapper: OdmPromotionMapper

    constructor( mongoose: Mongoose ) { 
        this.model = mongoose.model<OdmPromotionEntity>('odmpromotion', OdmPromotionSchema)
        this.odmMapper= new OdmPromotionMapper()
    }

        private trasnformtoDataModel(odm:OdmPromotionEntity):IPromotion{
            return {
                id:odm.id,
                description:odm.description,
                name:odm.name,
                state:odm.state,
                discount:Number(odm.discount),
                products:odm.products
                ? odm.products.map(product=>({
                    id:product.id,
                    name:product.name
                }))
                : [],
                bundles:odm.bundles
                ? odm.bundles.map(bundle=>({
                    id:bundle.id,
                    name:bundle.name
                }))
                : [],
                categories:[]
            }
        }
    
    async findAllPromotion(criteria: FindAllPromotionApplicationRequestDTO): Promise<Result<Promotion[]>> {
        try {
            const query: any = {};

            if (criteria.name) 
                query.name = { $regex: criteria.name, $options: 'i' }

            const odm = await this.model.find(query).exec()

            let elements:Promotion[]=[]

            for (const o of odm){
                if(o)
                elements.push(
                    await this.odmMapper.fromPersistencetoDomain(o)
                )
            }
            return Result.success(
                elements
            )
        
        } catch (error) {
            console.log(error)
            return Result.fail(error.message);
        }
    }
    async findPromotionById(id: PromotionId): Promise<Result<Promotion>> {
        try{
            let odm=await this.model.findOne({id:id.Value})
            if(!odm)
                return Result.fail( new NotFoundException('Find promotion unsucsessfully'))
            return Result.success(await this.odmMapper.fromPersistencetoDomain(odm))
        }
        catch(e){
            return Result.fail( new NotFoundException('Find promotion unsucsessfully'))
        }
    }
    async findPromotionWithMoreDetailsById(id: PromotionId): Promise<Result<IPromotion>> {
        try{
            let odm=await this.model.findOne({id:id.Value})
            if(!odm)
                return Result.fail( new NotFoundException('Find promotion unsucsessfully'))
            return Result.success( this.trasnformtoDataModel(odm))
        }
        catch(e){
            return Result.fail( new NotFoundException('Find promotion unsucsessfully'))
        } 
    }
    async verifyPromotionExistenceByName(promotionName: PromotionName): Promise<Result<boolean>> {
        try{
            const odm = await this.model.findOne({name:promotionName.Value})
            if(!odm) 
                return Result.success(false)
            return Result.success(true)
        }
        catch(e){
            return Result.fail( new NotFoundException('Find promotion unsucsessfully'))
        }  
    }
    async findAllPromo(): Promise<Result<Promotion[]>> {
        try{
            const odm = await this.model.find()
            if(!odm) 
                return Result.fail( new NotFoundException('Find promotion unsucsessfully'))
            return Result.success(
                odm
                    ? await Promise.all(odm.map(async o => await this.odmMapper.fromPersistencetoDomain(o)))
                    : []
            )
        }
        catch(e){
            return Result.fail( new NotFoundException('Find promotion unsucsessfully'))
        }  
    }
}