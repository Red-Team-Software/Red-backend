import { IApplicationService } from "src/common/application/services"
import { Result } from "src/common/utils/result-handler/result"
import { NotFoundBundleApplicationException } from "../../application-exception/not-found-bundle-application-exception"
import { FindBundleByIdApplicationRequestDTO } from "../../dto/request/find-bundle-by-id-application-request-dto"
import { FindBundleByIdApplicationResponseDTO } from "../../dto/response/find-bundle-by-id-application-response-dto"
import { BundleId } from "src/bundle/domain/value-object/bundle-id"
import { IQueryBundleRepository } from "../../query-repository/query-bundle-repository"


export class FindBundleByIdApplicationService extends 
IApplicationService<FindBundleByIdApplicationRequestDTO,FindBundleByIdApplicationResponseDTO>{
    constructor(
        private readonly bundleRepository:IQueryBundleRepository
    ){
        super()
    }
    async execute(data: FindBundleByIdApplicationRequestDTO): Promise<Result<FindBundleByIdApplicationResponseDTO>> {

        let response=await this.bundleRepository.findBundleWithMoreDetailById(BundleId.create(data.id))

        if(!response.isSuccess())
            return Result.fail(new NotFoundBundleApplicationException())

        let bundle=response.getValue

        return Result.success({
            name: bundle.name,
            description: bundle.description,
            images:bundle.images,
            price: bundle.price,
            currency: bundle.currency,
            weight: bundle.weigth,
            measurement: bundle.measurement,
            stock: bundle.stock,
            caducityDate: bundle.caducityDate
            ? bundle.caducityDate
            : null,
            discount:bundle.promotion
            ? bundle.promotion.map(b=>({
                id:b.id,
                percentage:b.discount 
            }))
            : [],
            category: bundle.categories
            ? bundle.categories.map(c=>({
                id: c.id,
                name:c.name
            }))
            : [],
            product: bundle.products
            ? bundle.products.map(p=>({
                id:p.id,
                name:p.name
            }))
            : []
        })
    }
    
}