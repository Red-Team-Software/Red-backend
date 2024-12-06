import { IApplicationService } from "src/common/application/services"
import { Result } from "src/common/utils/result-handler/result"
import { NotFoundProductApplicationException } from "../../application-exepction/not-found-product-application-exception"
import { ProductID } from "src/product/domain/value-object/product-id"
import { FindProductbyIdApplicationResponseDTO } from "../../dto/response/find-product-by-id-response-dto"
import { FindProductsbyIdApplicationRequestDTO } from "../../dto/request/find-product-by-id-request-dto"
import { IQueryProductRepository } from "../../query-repository/query-product-repository"


export class FindProductByIdApplicationService extends 
IApplicationService<FindProductsbyIdApplicationRequestDTO,FindProductbyIdApplicationResponseDTO>{
    constructor(
        private readonly queryProductRepository:IQueryProductRepository
    ){
        super()
    }
    async execute(data: FindProductsbyIdApplicationRequestDTO): Promise<Result<FindProductbyIdApplicationResponseDTO>> {

        let response=await this.queryProductRepository.findProductWithMoreDetailById(ProductID.create(data.id))
        if(!response.isSuccess())
            return Result.fail(new NotFoundProductApplicationException())
        let product=response.getValue
        return Result.success({...product})
    }
    
}