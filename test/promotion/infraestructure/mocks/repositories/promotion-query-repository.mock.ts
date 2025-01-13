import { NotFoundException } from "src/common/infraestructure/infraestructure-exception";
import { Result } from "src/common/utils/result-handler/result";
import { FindAllPromotionApplicationRequestDTO } from "src/promotion/application/dto/request/find-all-promotion-application-request-dto";
import { IPromotion } from "src/promotion/application/model/promotion.interface";
import { IQueryPromotionRepository } from "src/promotion/application/query-repository/promotion.query.repository.interface";
import { Promotion } from "src/promotion/domain/aggregate/promotion.aggregate";
import { PromotionId } from "src/promotion/domain/value-object/promotion-id";
import { PromotionName } from "src/promotion/domain/value-object/promotion-name";

export class PromotionQueryRepositoryMock implements IQueryPromotionRepository{

    constructor(private readonly promotions: Promotion[]){}
    
    async findAllPromo(): Promise<Result<Promotion[]>> {
        return Result.success(this.promotions);
    }

    async findAllPromotion(criteria: FindAllPromotionApplicationRequestDTO): Promise<Result<Promotion[]>> {
        let promotions= this.promotions.slice(criteria.page,criteria.perPage)
        return Result.success(promotions)
    }
    async findPromotionById(id: PromotionId): Promise<Result<Promotion>> {
        let promotion=this.promotions.find((p) => p.getId().equals(id))
        if (!promotion)
            return Result.fail(new NotFoundException('Find promotion by id unsucssessfully'))
        return Result.success(promotion)
    }
    async findPromotionWithMoreDetailsById(id: PromotionId): Promise<Result<IPromotion>> {
        throw new Error("Method not implemented.");
    }
    async verifyPromotionExistenceByName(promotionName: PromotionName): Promise<Result<boolean>> {
        let promotion=this.promotions.find((p) => p.PromotionName.equals(promotionName))
        if (!promotion)
            return Result.success(false)
        return Result.success(true)
    } 
}