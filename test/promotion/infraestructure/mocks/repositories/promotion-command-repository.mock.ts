import { Result } from "src/common/utils/result-handler/result";
import { Promotion } from "src/promotion/domain/aggregate/promotion.aggregate";
import { ICommandPromotionRepository } from "src/promotion/domain/repository/promotion.command.repository.interface";

export class PromotionCommandRepositoryMock  implements ICommandPromotionRepository{
    
    constructor(private promotions: Promotion[]){}

    async createPromotion(promotion: Promotion): Promise<Result<Promotion>> {
        this.promotions.push(promotion)
        return Result.success(promotion) 
    }
    async updatePromotion(promotion: Promotion): Promise<Result<Promotion>> {
        this.promotions = this.promotions.filter((p) => p.getId().equals(promotion.getId()))
        this.promotions.push(promotion)
        return Result.success(promotion)
    }
    async deletePromotion(promotion: Promotion): Promise<Result<Promotion>> {
        this.promotions = this.promotions.filter((p) => p.getId().equals(promotion.getId()))
        return Result.success(promotion)
    }
}