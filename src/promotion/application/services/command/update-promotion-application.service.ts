import { IQueryPromotionRepository } from "../../query-repository/promotion.query.repository.interface"
import { IIdGen } from "src/common/application/id-gen/id-gen.interface"
import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract"
import { Result } from "src/common/utils/result-handler/result"
import { PromotionName } from "src/promotion/domain/value-object/promotion-name"
import { ErrorPromotionNameAlreadyApplicationException } from "../../application-exepction/error-promotion-name-already-exist-application-exception"
import { Promotion } from "src/promotion/domain/aggregate/promotion.aggregate"
import { PromotionId } from "src/promotion/domain/value-object/promotion-id"
import { PromotionDescription } from "src/promotion/domain/value-object/promotion-description"
import { PromotionDiscount } from "src/promotion/domain/value-object/promotion-discount"
import { ProductID } from "src/product/domain/value-object/product-id"
import { BundleId } from "src/bundle/domain/value-object/bundle-id"
import { CategoryID } from "src/category/domain/value-object/category-id"
import { ErrorCreatingPromotionApplicationException } from "../../application-exepction/error-creating-promotion-application-exception"
import { IQueryProductRepository } from "src/product/application/query-repository/query-product-repository"
import { IQueryBundleRepository } from "src/bundle/application/query-repository/query-bundle-repository"
import { ErrorCreatingPromotionProductNotFoudApplicationException } from "../../application-exepction/error-creating-promotion-product-not-found-application-exception"
import { Product } from "src/product/domain/aggregate/product.aggregate"
import { Bundle } from "src/bundle/domain/aggregate/bundle.aggregate"
import { UpdatePromotionApplicationRequestDTO } from "../../dto/request/update-promotion-application-request-dto"
import { UpdatePromotionApplicationResponseDTO } from "../../dto/response/update-promotion-application-response-dto"
import { IApplicationService } from "src/common/application/services"
import { ICommandPromotionRepository } from "src/promotion/domain/repository/promotion.command.repository.interface"
import { NotFoundPromotionApplicationException } from "../../application-exepction/not-found-promotion-application-exception"


export class UpdatePromotionApplicationService extends IApplicationService 
<UpdatePromotionApplicationRequestDTO,UpdatePromotionApplicationResponseDTO> {

    constructor(
        private readonly commandPromotionRepository:ICommandPromotionRepository,
        private readonly queryPromotionRepository:IQueryPromotionRepository,
        private readonly queryProductRepository:IQueryProductRepository,
        private readonly queryBundleRepository:IQueryBundleRepository,
        private readonly idGen:IIdGen<string>,
        private readonly eventPublisher: IEventPublisher,
    ){
        super()
    }
    async execute(command: UpdatePromotionApplicationRequestDTO): Promise<Result<UpdatePromotionApplicationResponseDTO>> {

        let promotionResponse=await this.queryPromotionRepository.findPromotionById(
            PromotionId.create(command.id)
        )

        if (!promotionResponse.isSuccess())
            return Result.fail(new NotFoundPromotionApplicationException(command.id))

        let products:Product[]=[]
        let bundles:Bundle[]=[]

        let search=await this.queryPromotionRepository.verifyPromotionExistenceByName(
            PromotionName.create(command.name)
        )

        if (!search.isSuccess())
            return Result.fail(new ErrorCreatingPromotionApplicationException())

        if (search.getValue) 
            return Result.fail(new ErrorPromotionNameAlreadyApplicationException(command.name))

        for( const product of command.products){
            let productResponse=await this.queryProductRepository.findProductById(ProductID.create(product))
            if (!productResponse.isSuccess())
                return Result.fail(
                    new ErrorCreatingPromotionProductNotFoudApplicationException(product)
                )
            products.push(productResponse.getValue)
        }

        for( const bundle of command.bundles){
            let bundleResponse=await this.queryBundleRepository.findBundleById(BundleId.create(bundle))
            if (!bundleResponse.isSuccess())
                return Result.fail(
                    new ErrorCreatingPromotionProductNotFoudApplicationException(bundle)
                )
            bundles.push(bundleResponse.getValue)
        }

        const promotion=promotionResponse.getValue

        if(command.description)
            promotion.updateDescription(PromotionDescription.create(command.description))
        
        
        await this.eventPublisher.publish(promotion.pullDomainEvents())

        let response:UpdatePromotionApplicationResponseDTO={
            id:promotion.getId().Value,
            description:promotion.PromotionDescription.Value,
            name:promotion.PromotionName.Value,
            state:promotion.PromotionState.Value,
            discount:promotion.PromotionDiscounts.Value,
            products:promotion.Products.map(product=>({
                id:product.Value,
                name:products.find(savedproduct=>savedproduct.getId().equals(product)).ProductName.Value
            })),
            bundles:promotion.Bundles.map(bundle=>({
                id:bundle.Value,
                name:bundles.find(savedBundle=>savedBundle.getId().equals(bundle)).BundleName.Value
            })),
            categories:[]
        }
        return Result.success(response)
    }

}