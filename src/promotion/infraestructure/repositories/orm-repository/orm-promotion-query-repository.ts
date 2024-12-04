import { IMapper } from "src/common/application/mappers/mapper.interface";
import { UuidGen } from "src/common/infraestructure/id-gen/uuid-gen";
import { Result } from "src/common/utils/result-handler/result";
import { OrmProductEntity } from "src/product/infraestructure/entities/orm-entities/orm-product-entity";
import { OrmProductMapper } from "src/product/infraestructure/mapper/orm-mapper/orm-product-mapper";
import { IQueryPromotionRepository } from "src/promotion/application/query-repository/promotion.query.repository.interface";
import { Repository, DataSource, MoreThan } from "typeorm";
import { OrmPromotionEntity } from "../../entities/orm-entities/orm-promotion-entity";
import { FindAllPromotionApplicationRequestDTO } from "src/promotion/application/dto/request/find-all-promotion-application-request-dto";
import { Promotion } from "src/promotion/domain/aggregate/promotion.aggregate";
import { PromotionId } from "src/promotion/domain/value-object/promotion-id";
import { PromotionName } from "src/promotion/domain/value-object/promotion-name";
import { NotFoundException } from "src/common/infraestructure/infraestructure-exception";
import { OrmPromotionMapper } from "../../mapper/orm-mapper/orm-promotion-mapper";



export class OrmPromotionQueryRepository extends Repository<OrmPromotionEntity> implements IQueryPromotionRepository{

    private mapper:IMapper <Promotion,OrmPromotionEntity>

    constructor(dataSource:DataSource){
        super( OrmProductEntity, dataSource.createEntityManager() )
        this.mapper=new OrmPromotionMapper(new UuidGen())
    }

    findAllPromotion(criteria: FindAllPromotionApplicationRequestDTO): Promise<Result<Promotion[]>> {
        throw new Error("Method not implemented.");
    }
    findPromotionById(id: PromotionId): Promise<Result<IPromotion>> {
        throw new Error("Method not implemented.");
    }
    async verifyPromotionExistenceByName(promotionName: PromotionName): Promise<Result<boolean>> {
        try{
            let response=await this.existsBy({name:promotionName.Value})
            return Result.success(response)

        }catch(e){
            return Result.fail( new NotFoundException('Veify promotion existance unsucssessfully '))
        }
    } 
}