import { IMapper } from "src/common/application/mappers/mapper.interface";
import { UuidGen } from "src/common/infraestructure/id-gen/uuid-gen";
import { Result } from "src/common/utils/result-handler/result";
import { IQueryPromotionRepository } from "src/promotion/application/query-repository/promotion.query.repository.interface";
import { Repository, DataSource, MoreThan } from "typeorm";
import { OrmPromotionEntity } from "../../entities/orm-entities/orm-promotion-entity";
import { FindAllPromotionApplicationRequestDTO } from "src/promotion/application/dto/request/find-all-promotion-application-request-dto";
import { Promotion } from "src/promotion/domain/aggregate/promotion.aggregate";
import { PromotionId } from "src/promotion/domain/value-object/promotion-id";
import { PromotionName } from "src/promotion/domain/value-object/promotion-name";
import { NotFoundException } from "src/common/infraestructure/infraestructure-exception";
import { OrmPromotionMapper } from "../../mapper/orm-mapper/orm-promotion-mapper";
import { IPromotion } from "src/promotion/application/model/promotion.interface";



export class OrmPromotionQueryRepository extends Repository<OrmPromotionEntity> implements IQueryPromotionRepository{

    private mapper:IMapper <Promotion,OrmPromotionEntity>

    constructor(dataSource:DataSource){
        super( OrmPromotionEntity, dataSource.createEntityManager() )
        this.mapper=new OrmPromotionMapper(new UuidGen(),dataSource)
    }

    async findAllPromotion(criteria: FindAllPromotionApplicationRequestDTO): Promise<Result<Promotion[]>> {
        try{

            const ormPromotions = await this.createQueryBuilder('promotion')
                .leftJoinAndSelect('promotion.products', 'promotion_product')
                .leftJoinAndSelect('promotion.bundles', 'promotion_bundle')
                .where('LOWER(promotion.name) LIKE :name', 
                   { name: `%${criteria.name.toLowerCase().trim()}%` })
                .take(criteria.perPage)
                .skip(criteria.page)
                .getMany();


            // if(ormProducts.length==0)
            //     return Result.fail( new NotFoundException('products empty please try again'))

            const promotions:Promotion[]=[]

            for (const promotion of ormPromotions){
                promotions.push(await this.mapper.fromPersistencetoDomain(promotion))
            }
            return Result.success(promotions)
        }catch(e){
            return Result.fail( new NotFoundException('error finding promotion please try again'))
        }
    }

    async findPromotionById(id: PromotionId): Promise<Result<Promotion>> {
        try{
            const ormPromotion=await this.findOneBy({id:id.Value})
            
            if(!ormPromotion)
                return Result.fail( new NotFoundException('Find promotion unsucssessfully'))

            const activity=await this.mapper.fromPersistencetoDomain(ormPromotion)
            
            return Result.success(activity)
        }catch(e){
            return Result.fail( new NotFoundException('Find promotion unsucssessfully'))
        }    
    }

    async findPromotionWithMoreDetailsById(id: PromotionId): Promise<Result<IPromotion>> {
        try{
            const ormPromotion=await this.findOneBy({id:id.Value})
            
            if(!ormPromotion)
                return Result.fail( new NotFoundException('Find promotion unsucssessfully'))
            
            return Result.success({
                id:ormPromotion.id,
                description:ormPromotion.description,
                name:ormPromotion.name,
                state:ormPromotion.state,
                discount:Number(ormPromotion.discount),
                products:ormPromotion.products
                ? ormPromotion.products.map(product=>({
                    id:product.id,
                    name:product.name
                }))
                : [],
                bundles:ormPromotion.bundles
                ? ormPromotion.bundles.map(bundle=>({
                    id:bundle.id,
                    name:bundle.name
                }))
                : [],
                categories:[]
            })
        }catch(e){
            return Result.fail( new NotFoundException('Find promotion unsucssessfully'))
        }  
    }
    async verifyPromotionExistenceByName(promotionName: PromotionName): Promise<Result<boolean>> {
        try{
            let response=await this.existsBy({name:promotionName.Value})
            return Result.success(response)

        }catch(e){
            return Result.fail( new NotFoundException('Veify promotion existance unsucssessfully '))
        }
    } 

    async findAllPromo(): Promise<Result<Promotion[]>> {
        try{

            const ormPromotions = await this.createQueryBuilder('promotion')
                .leftJoinAndSelect('promotion.products', 'promotion_product')
                .leftJoinAndSelect('promotion.bundles', 'promotion_bundle')
                .getMany();


            // if(ormProducts.length==0)
            //     return Result.fail( new NotFoundException('products empty please try again'))

            const promotions:Promotion[]=[]

            for (const promotion of ormPromotions){
                promotions.push(await this.mapper.fromPersistencetoDomain(promotion))
            }
            return Result.success(promotions)
        }catch(e){
            return Result.fail( new NotFoundException('error finding promotion please try again'))
        }
    }
}