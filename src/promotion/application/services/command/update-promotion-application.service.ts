import { IQueryPromotionRepository } from "../../query-repository/promotion.query.repository.interface"
import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract"
import { Result } from "src/common/utils/result-handler/result"
import { PromotionName } from "src/promotion/domain/value-object/promotion-name"
import { ErrorPromotionNameAlreadyApplicationException } from "../../application-exepction/error-promotion-name-already-exist-application-exception"
import { PromotionId } from "src/promotion/domain/value-object/promotion-id"
import { PromotionDescription } from "src/promotion/domain/value-object/promotion-description"
import { PromotionDiscount } from "src/promotion/domain/value-object/promotion-discount"
import { ProductID } from "src/product/domain/value-object/product-id"
import { BundleId } from "src/bundle/domain/value-object/bundle-id"
import { IQueryProductRepository } from "src/product/application/query-repository/query-product-repository"
import { IQueryBundleRepository } from "src/bundle/application/query-repository/query-bundle-repository"
import { Product } from "src/product/domain/aggregate/product.aggregate"
import { Bundle } from "src/bundle/domain/aggregate/bundle.aggregate"
import { UpdatePromotionApplicationRequestDTO } from "../../dto/request/update-promotion-application-request-dto"
import { UpdatePromotionApplicationResponseDTO } from "../../dto/response/update-promotion-application-response-dto"
import { IApplicationService } from "src/common/application/services"
import { ICommandPromotionRepository } from "src/promotion/domain/repository/promotion.command.repository.interface"
import { NotFoundPromotionApplicationException } from "../../application-exepction/not-found-promotion-application-exception"
import { ErrorUpdatingPromotionApplicationException } from "../../application-exepction/error-updating-promotion-application-exception"
import { ErrorDTOUpdatingPromotionApplicationException } from "../../application-exepction/error-dto-updating-promotion-application-exception"
import { PromotionState } from "src/promotion/domain/value-object/promotion-state"


export class UpdatePromotionApplicationService extends IApplicationService 
<UpdatePromotionApplicationRequestDTO,UpdatePromotionApplicationResponseDTO> {

    constructor(
        private readonly commandPromotionRepository:ICommandPromotionRepository,
        private readonly queryPromotionRepository:IQueryPromotionRepository,
        private readonly queryProductRepository:IQueryProductRepository,
        private readonly queryBundleRepository:IQueryBundleRepository,
        private readonly eventPublisher: IEventPublisher,
    ){
        super()
    }
    async execute(command: UpdatePromotionApplicationRequestDTO): Promise<Result<UpdatePromotionApplicationResponseDTO>> {

        if (!command.bundles && 
            !command.description &&
            !command.discount &&
            !command.name &&
            !command.products &&
            !command.state
        )
          return Result.fail(new ErrorDTOUpdatingPromotionApplicationException())

        let promotionResponse=await this.queryPromotionRepository.findPromotionById(
            PromotionId.create(command.id)
        )

        if (!promotionResponse.isSuccess())
            return Result.fail(new NotFoundPromotionApplicationException(command.id))

        const promotion=promotionResponse.getValue

        if(command.description)
            promotion.updateDescription(PromotionDescription.create(command.description))
        
        if(command.discount)
            promotion.updateDiscount(PromotionDiscount.create(command.discount))
        
        if(command.state)
            promotion.updateState(PromotionState.create(command.state))

        if(command.name){
            let search=await this.queryPromotionRepository.verifyPromotionExistenceByName(
                PromotionName.create(command.name)
            )
    
            if (!search.isSuccess())
                return Result.fail(new ErrorUpdatingPromotionApplicationException(command.id))
    
            if (search.getValue) 
                return Result.fail(new ErrorPromotionNameAlreadyApplicationException(command.name))

            promotion.updateName(PromotionName.create(command.name))
        }

        if(command.products){

            let products:Product[]=[]
    
            for( const product of command.products){
                let productResponse=await this.queryProductRepository.findProductById(ProductID.create(product))
                if (!productResponse.isSuccess())
                    return Result.fail(
                        productResponse.getError
                    )
                products.push(productResponse.getValue)
            }

            promotion.updateProducts(
                products.map(p=>p.getId())
            )
        }
        
        if(command.bundles){
            let bundles:Bundle[]=[]
            
            for( const bundle of command.bundles){
                let bundleResponse=await this.queryBundleRepository.findBundleById(BundleId.create(bundle))
                if (!bundleResponse.isSuccess())
                    return Result.fail(
                        bundleResponse.getError
                    )
                bundles.push(bundleResponse.getValue)
            }
            promotion.updateBundles(
                bundles.map(b=>b.getId())
            )
        }

        let updateResponse=await this.commandPromotionRepository.updatePromotion(promotion)

        if (!updateResponse.isSuccess())
            return Result.fail(new ErrorUpdatingPromotionApplicationException(promotion.getId().Value))
        
        await this.eventPublisher.publish(promotion.pullDomainEvents())

        let response:UpdatePromotionApplicationResponseDTO={
            id:promotion.getId().Value,
            description:promotion.PromotionDescription.Value,
            name:promotion.PromotionName.Value,
            state:promotion.PromotionState.Value,
            discount:promotion.PromotionDiscounts.Value,
            products:promotion.Products.map(product=>product.Value),
            bundles:promotion.Bundles.map(bundle=>bundle.Value),
            categories:[]
        }
        return Result.success(response)
    }

}