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

        return Result.success(
            bundles
            ? bundles.map(b=>({
                id: b.id,
                name: b.name,
                description: b.description,
                images: b.images,
                price: b.price,
                currency: b.currency,
                weight: b.weigth,
                measurement: b.measurement,
                stock:b.stock,
                discount: b.promotion
                ? b.promotion.map(p=>({
                    id:p.id,
                    percentage:p.discount 
                }))
                : [],
                category: b.categories
                ? b.categories.map(c=>({
                    id:c.id,
                    name:c.name
                }))
                : []
            }))
            :[]
        )
    }
    
}