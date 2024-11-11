import { IApplicationService } from "src/common/application/services"
import { IQueryProductRepository } from "../../query-repository/query-product-repository"
import { Result } from "src/common/utils/result-handler/result"
import { NotFoundProductApplicationException } from "../../application-exepction/not-found-product-application-exception"
import { FindAllProductsAndCombosApplicationResponseDTO } from "../../dto/response/find-all-products-and-combos-application-response-dto"
import { FindAllProductsbyNameApplicationRequestDTO } from "../../dto/request/find-all-products-and-combos-request-dto"
import { IQueryBundleRepository } from "src/bundle/application/query-repository/query-bundle-repository"
import { NotFoundBundleApplicationException } from "src/bundle/application/application-exeption/not-found-bundle-application-exception"


export class FindAllProductsAndComboApplicationService extends 
IApplicationService<FindAllProductsbyNameApplicationRequestDTO,FindAllProductsAndCombosApplicationResponseDTO>{
    constructor(
        private readonly queryProductRepository:IQueryProductRepository,
        private readonly queryBundleRepository:IQueryBundleRepository
    ){
        super()
    }
    async execute(data: FindAllProductsbyNameApplicationRequestDTO): Promise<Result<FindAllProductsAndCombosApplicationResponseDTO>> {

        data.page = data.page * data.perPage - data.perPage

        let responsebundle=await this.queryBundleRepository.findAllBundlesByName(data)

        if(!responsebundle.isSuccess())
            return Result.fail(new NotFoundBundleApplicationException())

        let responseproduct=await this.queryProductRepository.findAllProductsByName(data)

        if(!responseproduct.isSuccess())
            return Result.fail(new NotFoundProductApplicationException())
        
        let products=responseproduct.getValue
        let bundles=responsebundle.getValue

        let responseDto:FindAllProductsAndCombosApplicationResponseDTO={
            product:[],
            bundle:[]
        }

        products.forEach((p)=>{
            responseDto.product.push({
                id:p.getId().Value,
                description:p.ProductDescription.Value,
                name:p.ProductName.Value,
                images:p.ProductImages.map(image=>image.Value),
                price:p.ProductPrice.Price,
                currency:p.ProductPrice.Currency
            })
        })

        bundles.forEach((b)=>{
            responseDto.bundle.push({
                id:b.getId().Value,
                description:b.BundleDescription.Value,
                name:b.BundleName.Value,
                images:b.BundleImages.map(image=>image.Value),
                price:b.BundlePrice.Price,
                currency:b.BundlePrice.Currency
            })
        })

        return Result.success(responseDto)
    }
    
}