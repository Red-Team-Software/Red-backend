import { IApplicationService } from "src/common/application/services"
import { Result } from "src/common/utils/result-handler/result"
import { FindAllPromotionApplicationRequestDTO } from "../../dto/request/find-all-promotion-application-request-dto"
import { FindAllPromotionApplicationResponseDTO } from "../../dto/response/find-all-promotion-application-response-dto"
import { IQueryPromotionRepository } from "../../query-repository/promotion.query.repository.interface"
import { NotFoundPromotionApplicationException } from "../../application-exepction/not-found-promotion-application-exception"



export class FindAllPromotionApplicationService extends 
IApplicationService<FindAllPromotionApplicationRequestDTO,FindAllPromotionApplicationResponseDTO[]>{
    constructor(
        private readonly queryPromotionRepository:IQueryPromotionRepository
    ){
        super()
    }
    async execute(data: FindAllPromotionApplicationRequestDTO): Promise<Result<FindAllPromotionApplicationResponseDTO[]>> {

        data.page = data.page * data.perPage - data.perPage

        let response=await this.queryPromotionRepository.findAllPromotion(data)

        if(!response.isSuccess())
            return Result.fail(new NotFoundPromotionApplicationException(data.name))
        
        let promotions=response.getValue

        let responseDto:FindAllPromotionApplicationResponseDTO[]=[]

        promotions.forEach((promotion)=>{
            responseDto.push({
                id:promotion.getId().Value,
                description:promotion.PromotionDescription.Value,
                name:promotion.PromotionName.Value,
                state:promotion.PromotionState.Value,
                discount:promotion.PromotionDiscounts.Value,
                products:promotion.Products.map(product=>product.Value),
                bundles:promotion.Bundles.map(bundle=>bundle.Value),
                categories:promotion.Categories.map(category=>category.Value)
            })
        })
        return Result.success(responseDto)
    }
    
}