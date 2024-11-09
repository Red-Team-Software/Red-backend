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

        let responseproduct=await this.queryProductRepository.findAllProductsByName(data)

        // console.log(responsebundle)
        if(!responseproduct.isSuccess())
            return Result.fail(new NotFoundProductApplicationException())

        
        if(!responsebundle.isSuccess())
            return Result.fail(new NotFoundBundleApplicationException())
        
        let products=responseproduct.getValue
        let bundles=responsebundle.getValue

        let responseDto:FindAllProductsAndCombosApplicationResponseDTO={
            product:[],
            bundle:[]
        }

        products.forEach((p)=>{
            responseDto.product.push({
                productId:p.getId().Value,
                productDescription:p.ProductDescription.Value,
                productName:p.ProductName.Value,
                productImages:p.ProductImages.map(image=>image.Value),
                productPrice:p.ProductPrice.Price,
                productCurrency:p.ProductPrice.Currency
            })
        })

        bundles.forEach((b)=>{
            responseDto.bundle.push({
                bunldleId:b.getId().Value,
                bunldleDescription:b.BundleDescription.Value,
                bunldleName:b.BundleName.Value,
                bunldleImages:b.BundleImages.map(image=>image.Value),
                bunldlePrice:b.BundlePrice.Price,
                bunldleCurrency:b.BundlePrice.Currency
            })
        })

        return Result.success(responseDto)
    }
    
}