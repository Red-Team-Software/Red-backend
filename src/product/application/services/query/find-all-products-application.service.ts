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
            ?   products.map(p=>({
                id: p.id,
                name:p.name,
                description:p.description,
                images: p.images,
                price: p.price,
                currency:p.currency,
                weight: p.weigth,
                measurement: p.measurement,
                stock:p.stock,
                discount:p.promotion
                ? p.promotion.map(pr=>({
                    id:pr.id,
                    percentage:pr.discount,
                    name:pr.name
                }))
                : [],
                category:p.categories
                ? p.categories.map(c=>({
                    id: c.id,
                    name:c.name
                }))
                : []
            }))
            : []
        )   
    }
    
}