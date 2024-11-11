import { IApplicationService } from "src/common/application/services"
import { FindAllProductsApplicationRequestDTO } from "../../dto/request/find-all-products-application-request-dto"
import { FindAllProductsApplicationResponseDTO } from "../../dto/response/find-all-products-application-response-dto"
import { IQueryProductRepository } from "../../query-repository/query-product-repository"
import { Result } from "src/common/utils/result-handler/result"
import { NotFoundProductApplicationException } from "../../application-exepction/not-found-product-application-exception"


export class FindAllProductsApplicationService extends 
IApplicationService<FindAllProductsApplicationRequestDTO,FindAllProductsApplicationResponseDTO[]>{
    constructor(
        private readonly queryProductRepository:IQueryProductRepository
    ){
        super()
    }
    async execute(data: FindAllProductsApplicationRequestDTO): Promise<Result<FindAllProductsApplicationResponseDTO[]>> {

        data.page = data.page * data.perPage - data.perPage

        let response=await this.queryProductRepository.findAllProducts(data)
        if(!response.isSuccess())
            return Result.fail(new NotFoundProductApplicationException())
        let products=response.getValue

        let responseDto:FindAllProductsApplicationResponseDTO[]=[]

        products.forEach((product)=>{
            responseDto.push({
                id:product.getId().Value,
                description:product.ProductDescription.Value,
                name:product.ProductName.Value,
                images:product.ProductImages.map(image=>image.Value),
                price:product.ProductPrice.Price,
                currency:product.ProductPrice.Currency,
            })
        })
        return Result.success(responseDto)
    }
    
}