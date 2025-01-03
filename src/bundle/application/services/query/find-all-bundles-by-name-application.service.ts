import { IApplicationService } from "src/common/application/services"
import { FindAllBundlesApplicationResponseDTO } from "../../dto/response/find-all-bundles-application-response-dto"
import { IQueryBundleRepository } from "../../query-repository/query-bundle-repository"
import { Result } from "src/common/utils/result-handler/result"
import { NotFoundBundleApplicationException } from "../../application-exception/not-found-bundle-application-exception"
import { FindAllBundlesbyNameApplicationRequestDTO } from "../../dto/request/find-all-bundles-by-name-application-request-dto"
import { FindAllBundlesbyNameApplicationResponseDTO } from "../../dto/response/find-all-bundles-by-name-application-response-dto"

export class FindAllBundlesByNameApplicationService extends 
IApplicationService<FindAllBundlesbyNameApplicationRequestDTO,FindAllBundlesbyNameApplicationResponseDTO[]>{
    constructor(
        private readonly querybundleRepository:IQueryBundleRepository
    ){
        super()
    }
    async execute(data: FindAllBundlesbyNameApplicationRequestDTO): Promise<Result<FindAllBundlesbyNameApplicationResponseDTO[]>> {

        data.page = data.page * data.perPage - data.perPage

        let response=await this.querybundleRepository.findAllBundlesByName(data)

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