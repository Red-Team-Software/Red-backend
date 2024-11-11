import { IBundleRepository } from "src/bundle/domain/repository/product.interface.repositry"
import { IApplicationService } from "src/common/application/services"
import { Result } from "src/common/utils/result-handler/result"
import { NotFoundBundleApplicationException } from "../../application-exeption/not-found-bundle-application-exception"
import { FindBundleByIdApplicationRequestDTO } from "../../dto/request/find-bundle-by-id-application-request-dto"
import { FindBundleByIdApplicationResponseDTO } from "../../dto/response/find-bundle-by-id-application-response-dto"
import { BundleId } from "src/bundle/domain/value-object/bundle-id"


export class FindBundleByIdApplicationService extends 
IApplicationService<FindBundleByIdApplicationRequestDTO,FindBundleByIdApplicationResponseDTO>{
    constructor(
        private readonly bundleRepository:IBundleRepository
    ){
        super()
    }
    async execute(data: FindBundleByIdApplicationRequestDTO): Promise<Result<FindBundleByIdApplicationResponseDTO>> {


        let response=await this.bundleRepository.findBundleById(BundleId.create(data.id))

        if(!response.isSuccess())
            return Result.fail(new NotFoundBundleApplicationException())
        let bundle=response.getValue

        let responseDto:FindBundleByIdApplicationResponseDTO={
                id:bundle.getId().Value,
                description:bundle.BundleDescription.Value,
                name:bundle.BundleName.Value,
                images:bundle.BundleImages.map(image=>image.Value),
                price:bundle.BundlePrice.Price,
                currency:bundle.BundlePrice.Currency,
                weigth:bundle.BundleWeigth.Weigth,
                measurement:bundle.BundleWeigth.Measure
            }

        return Result.success(responseDto)
    }
    
}