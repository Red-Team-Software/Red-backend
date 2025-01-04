import { DataSource, Repository } from "typeorm";
import { Result } from "src/common/utils/result-handler/result";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { UuidGen } from "src/common/infraestructure/id-gen/uuid-gen";
import { ICommandPromotionRepository } from "src/promotion/domain/repository/promotion.command.repository.interface";
import { Promotion } from "src/promotion/domain/aggregate/promotion.aggregate";
import { OrmPromotionMapper } from "../../mapper/orm-mapper/orm-promotion-mapper";
import { OrmPromotionEntity } from "../../entities/orm-entities/orm-promotion-entity";
import { PersistenceException } from "src/common/infraestructure/infraestructure-exception";


export class OrmPromotionCommandRepository extends Repository<OrmPromotionEntity> implements ICommandPromotionRepository{

    private mapper:IMapper <Promotion,OrmPromotionEntity>

    constructor(dataSource:DataSource){
        super( OrmPromotionEntity, dataSource.createEntityManager() )
        this.mapper=new OrmPromotionMapper(new UuidGen(),dataSource)
    }
    
    async createPromotion(promotion: Promotion): Promise<Result<Promotion>> {
        try{
            const entry=await this.mapper.fromDomaintoPersistence(promotion)
                        
            const response= await this.save(entry)
            
            if (!response)
                return Result.fail( new PersistenceException('Create promotion unsucssessfully') )

            return Result.success(promotion)
        }catch(e){
            return Result.fail( new PersistenceException('Create promotion unsucssessfully') )
        }
    }
    async updatePromotion(promotion: Promotion): Promise<Result<Promotion>> {
        const persis = await this.mapper.fromDomaintoPersistence(promotion)
        try {

            const result = await this.save(persis)
                          
            return Result.success(promotion)
        
        } catch (e) {
            return Result.fail(new PersistenceException('Update product unsucssessfully'))
        }
    }
    deletePromotion(promotion: Promotion): Promise<Result<Promotion>> {
        throw new Error("Method not implemented.");
    }

}