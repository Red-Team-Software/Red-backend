import { IApplicationService } from "src/common/application/services"
import { FindAllBundlesApplicationRequestDTO } from "../../dto/request/find-all-bundles-application-request-dto"
import { FindAllBundlesApplicationResponseDTO } from "../../dto/response/find-all-bundles-application-response-dto"
import { IQueryBundleRepository } from "../../query-repository/query-bundle-repository"
import { Result } from "src/common/utils/result-handler/result"
import { NotFoundBundleApplicationException } from "../../application-exception/not-found-bundle-application-exception"

export class FindAllBundlesApplicationService extends 
IApplicationService<FindAllBundlesApplicationRequestDTO,FindAllBundlesApplicationResponseDTO[]>{
    constructor(
        private readonly querybundleRepository:IQueryBundleRepository
    ){
        super()
    }
    async execute(data: FindAllBundlesApplicationRequestDTO): Promise<Result<FindAllBundlesApplicationResponseDTO[]>> {

        data.page = data.page * data.perPage - data.perPage

        let response=await this.querybundleRepository.findAllBundles(data)
        if(!response.isSuccess())
            return Result.fail(new NotFoundBundleApplicationException())
        let bundles=response.getValue

        let responseDto:FindAllBundlesApplicationResponseDTO[]=[]

        bundles.forEach((bundle)=>{
            responseDto.push({
                id:bundle.getId().Value,
                description:bundle.BundleDescription.Value,
                name:bundle.BundleName.Value,
                images:bundle.BundleImages.map(image=>image.Value),
                price:bundle.BundlePrice.Price,
                currency:bundle.BundlePrice.Currency,
            })
        })
        return Result.success(responseDto)
    }
    
}