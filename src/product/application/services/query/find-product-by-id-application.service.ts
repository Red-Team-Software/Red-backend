import { IApplicationService } from "src/common/application/services"
import { Result } from "src/common/utils/result-handler/result"
import { NotFoundProductApplicationException } from "../../application-exepction/not-found-product-application-exception"
import { IProductRepository } from "src/product/domain/repository/product.repositry.interface"
import { ProductID } from "src/product/domain/value-object/product-id"
import { FindProductbyIdApplicationResponseDTO } from "../../dto/response/find-product-by-id-response-dto"
import { FindProductsbyIdApplicationRequestDTO } from "../../dto/request/find-product-by-id-request-dto"


export class FindProductByIdApplicationService extends 
IApplicationService<FindProductsbyIdApplicationRequestDTO,FindProductbyIdApplicationResponseDTO>{
    constructor(
        private readonly queryProductRepository:IProductRepository
    ){
        super()
    }
    async execute(data: FindProductsbyIdApplicationRequestDTO): Promise<Result<FindProductbyIdApplicationResponseDTO>> {

        let response=await this.queryProductRepository.findProductById(ProductID.create(data.id))
        if(!response.isSuccess())
            return Result.fail(new NotFoundProductApplicationException())
        let product=response.getValue

        let responseDto:FindProductbyIdApplicationResponseDTO={
            id:product.getId().Value,
            description:product.ProductDescription.Value,
            name:product.ProductName.Value,
            images:product.ProductImages.map(image=>image.Value),
            price:product.ProductPrice.Price,
            currency:product.ProductPrice.Currency,
            weigth:product.ProductWeigth.Weigth,
            measurement:product.ProductWeigth.Measure
        }

        return Result.success(responseDto)
    }
    
}