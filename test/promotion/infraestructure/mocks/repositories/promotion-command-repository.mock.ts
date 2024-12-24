import { Result } from "src/common/utils/result-handler/result";
import { Promotion } from "src/promotion/domain/aggregate/promotion.aggregate";
import { ICommandPromotionRepository } from "src/promotion/domain/repository/promotion.command.repository.interface";

export class PromotionCommandRepositoryMock  implements ICommandPromotionRepository{
    
    constructor(private readonly promotions: Promotion[]){}

    createPromotion(promotion: Promotion): Promise<Result<Promotion>> {
        throw new Error("Method not implemented.");
    }
    updatePromotion(promotion: Promotion): Promise<Result<Promotion>> {
        throw new Error("Method not implemented.");
    }
    deletePromotion(promotion: Promotion): Promise<Result<Promotion>> {
        throw new Error("Method not implemented.");
    }
}