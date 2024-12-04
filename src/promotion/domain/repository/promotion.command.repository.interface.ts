import { Result } from "src/common/utils/result-handler/result"
import { Promotion } from "../aggregate/promotion.aggregate"


export interface ICommandPromotionRepository {
    createPromotion( promotion: Promotion ): Promise<Result<Promotion>>
    updatePromotion( promotion: Promotion ): Promise<Result<Promotion>>
    deletePromotion( promotion: Promotion ): Promise<Result<Promotion>>
}