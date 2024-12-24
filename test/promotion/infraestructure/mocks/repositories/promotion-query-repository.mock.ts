import { Result } from "src/common/utils/result-handler/result";
import { FindAllPromotionApplicationRequestDTO } from "src/promotion/application/dto/request/find-all-promotion-application-request-dto";
import { IQueryPromotionRepository } from "src/promotion/application/query-repository/promotion.query.repository.interface";
import { Promotion } from "src/promotion/domain/aggregate/promotion.aggregate";
import { PromotionId } from "src/promotion/domain/value-object/promotion-id";
import { PromotionName } from "src/promotion/domain/value-object/promotion-name";

export class OrmPromotionQueryRepository implements IQueryPromotionRepository{

    constructor(private readonly promotions: Promotion[]){}

    findAllPromotion(criteria: FindAllPromotionApplicationRequestDTO): Promise<Result<Promotion[]>> {
        throw new Error("Method not implemented.");
    }
    findPromotionById(id: PromotionId): Promise<Result<Promotion>> {
        throw new Error("Method not implemented.");
    }
    findPromotionWithMoreDetailsById(id: PromotionId): Promise<Result<IPromotion>> {
        throw new Error("Method not implemented.");
    }
    verifyPromotionExistenceByName(promotionName: PromotionName): Promise<Result<boolean>> {
        throw new Error("Method not implemented.");
    }
 
}