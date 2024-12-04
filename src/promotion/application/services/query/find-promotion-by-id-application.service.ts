import { IApplicationService } from "src/common/application/services"
import { Result } from "src/common/utils/result-handler/result"
import { IQueryPromotionRepository } from "../../query-repository/promotion.query.repository.interface"
import { NotFoundPromotionApplicationException } from "../../application-exepction/not-found-promotion-application-exception"
import { PromotionId } from "src/promotion/domain/value-object/promotion-id"
import { FindPromotionByIdApplicationRequestDTO } from "../../dto/request/find-promotion-by-id-application-request-dto"
import { FindPromotionbyIdApplicationResponseDTO } from "../../dto/response/find-promotion-by-id-application-response-dto"




export class FindPromotionByIdApplicationService extends 
IApplicationService<FindPromotionByIdApplicationRequestDTO,FindPromotionbyIdApplicationResponseDTO>{
    constructor(
        private readonly queryPromotionRepository:IQueryPromotionRepository
    ){
        super()
    }
    async execute(data: FindPromotionByIdApplicationRequestDTO): Promise<Result<FindPromotionbyIdApplicationResponseDTO>> {

        let response=await this.queryPromotionRepository.findPromotionById(
            PromotionId.create(data.id)
        )

        if(!response.isSuccess())
            return Result.fail(new NotFoundPromotionApplicationException(data.id))
        
        const promotion=response.getValue
        
        return Result.success(
            {
                id:promotion.promotionId,
                description:promotion.promotionDescription,
                name:promotion.promotionName,
                avaleableState:promotion.promotionAvaleableState,
                discount:promotion.promotionDiscount,
                products:promotion.products.map(product=>({
                    id:product.id,
                    name:product.name
                })),
                bundles:promotion.bundles.map(bundle=>({
                    id:bundle.id,
                    name:bundle.name
                })),
                categories:promotion.categories.map(category=>({
                    id:category.id,
                    name:category.name
                }))
            }
        )
    }
    
}