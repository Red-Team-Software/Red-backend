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

        return Result.success( 
            products
            ?   products.map(product=>({
                id:product.id,
                name:product.name,
                images:product.images,
                price:product.price,
                currency:product.currency,
                weight:product.weigth,
                measurement:product.measurement,
                stock:product.stock,
                discount:product.promotion.map(p=>({
                    id:p.id,
                    percentage:p.discount
                }))
            }))
            : []
    )
    
        
    }
    
}