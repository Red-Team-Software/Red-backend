import { IApplicationService } from "src/common/application/services"
import { Result } from "src/common/utils/result-handler/result"
import { NotFoundProductApplicationException } from "../../application-exepction/not-found-product-application-exception"
import { ProductID } from "src/product/domain/value-object/product-id"
import { FindProductbyIdApplicationResponseDTO } from "../../dto/response/find-product-by-id-application-response-dto"
import { FindProductsbyIdApplicationRequestDTO } from "../../dto/request/find-product-by-id-aplication-request-dto"
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
        return Result.success({
            name: product.name,
            description: product.description,
            images:product.images,
            price: product.price,
            currency: product.currency,
            weight: product.weigth,
            measurement: product.measurement,
            stock: product.stock,
            caducityDate:product.caducityDate
            ? product.caducityDate
            : null,
            discount: product.promotion
            ? product.promotion.map(p=>({
                id:p.id,
                percentage:p.discount 
            }))
            : [],
            category: product.categories
            ? product.categories.map(c=>({
                id: c.id,
                name:c.name
            }))
            : []
        })
    }
    
}