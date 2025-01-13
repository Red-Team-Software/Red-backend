import { Result } from "src/common/utils/result-handler/result"
import { PromotionId } from "src/promotion/domain/value-object/promotion-id"
import { FindAllPromotionApplicationRequestDTO } from "../dto/request/find-all-promotion-application-request-dto"
import { PromotionName } from "src/promotion/domain/value-object/promotion-name"
import { Promotion } from "src/promotion/domain/aggregate/promotion.aggregate"
import { IPromotion } from "../model/promotion.interface"


export interface IQueryPromotionRepository{
    findAllPromotion(criteria:FindAllPromotionApplicationRequestDTO):Promise<Result<Promotion[]>> 
    findPromotionById(id:PromotionId):Promise<Result<Promotion>>
    findPromotionWithMoreDetailsById(id:PromotionId):Promise<Result<IPromotion>>
    verifyPromotionExistenceByName(promotionName:PromotionName):Promise<Result<boolean>>
    findAllPromo(): Promise<Result<Promotion[]>>
}