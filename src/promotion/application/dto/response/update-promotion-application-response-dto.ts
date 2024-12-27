import { IServiceResponseDto } from "src/common/application/services"
import { IPromotion } from "../../model/promotion.interface";

export interface UpdatePromotionApplicationResponseDTO extends IServiceResponseDto, IPromotion{
}