import { IApplicationService } from "src/common/application/services"
import { CreatePromotionApplicationRequestDTO } from "../../dto/request/create-promotion-application-request-dto"
import { CreatePromotionApplicationResponseDTO } from "../../dto/response/create-promotion-application-response-dto"
import { ICommandPromotionRepository } from "src/promotion/domain/repository/promotion.command.repository.interface"
import { IQueryPromotionRepository } from "../../query-repository/promotion.query.repository.interface"
import { IIdGen } from "src/common/application/id-gen/id-gen.interface"
import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract"
import { Result } from "src/common/utils/result-handler/result"
import { PromotionName } from "src/promotion/domain/value-object/promotion-name"
import { ErrorPromotionNameAlreadyApplicationException } from "../../application-exepction/error-promotion-name-already-exist-application-exception"
import { Promotion } from "src/promotion/domain/aggregate/promotion.aggregate"
import { PromotionId } from "src/promotion/domain/value-object/promotion-id"
import { PromotionDescription } from "src/promotion/domain/value-object/promotion-description"
import { PromotionAvaleableState } from "src/promotion/domain/value-object/promotion-avaleable-state"
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


export class CreatePromotionApplicationService extends IApplicationService 
<CreatePromotionApplicationRequestDTO,CreatePromotionApplicationResponseDTO> {

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
    async execute(command: CreatePromotionApplicationRequestDTO): Promise<Result<CreatePromotionApplicationResponseDTO>> {

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

        let promotion=Promotion.Registerpromotion(
            PromotionId.create(await this.idGen.genId()),
            PromotionDescription.create(command.description),
            PromotionName.create(command.name),
            PromotionAvaleableState.create(command.avaleableState),
            PromotionDiscount.create(command.discount),
            command.products.map(product=>ProductID.create(product)),
            command.bundles.map(bundle=>BundleId.create(bundle)),
            []
        )

        let result=await this.commandPromotionRepository.createPromotion(promotion)

        if (!result.isSuccess()) 
            return Result.fail(new ErrorCreatingPromotionApplicationException())
        
        await this.eventPublisher.publish(promotion.pullDomainEvents())

        let response:CreatePromotionApplicationResponseDTO={
            ...command,
            id:promotion.getId().Value
        }
        return Result.success(response)
    }

}