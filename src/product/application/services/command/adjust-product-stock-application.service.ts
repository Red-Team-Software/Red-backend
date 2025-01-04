import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract"
import { IApplicationService } from "src/common/application/services"
import { Result } from "src/common/utils/result-handler/result"
import { ICommandProductRepository } from "src/product/domain/repository/product.command.repositry.interface"
import { ProductID } from "src/product/domain/value-object/product-id"
import { IQueryProductRepository } from "../../query-repository/query-product-repository"
import { NotFoundProductApplicationException } from "../../application-exepction/not-found-product-application-exception"
import { AdjustProductStockApplicationRequestDTO } from "../../dto/request/adjust-product-stock-application-request-dto"
import { AdjustProductStockApplicationResponseDTO } from "../../dto/response/adjust-product-stock-application-response-dto"
import { Product } from "src/product/domain/aggregate/product.aggregate"


export class AdjustProductStockApplicationService extends IApplicationService 
<
    AdjustProductStockApplicationRequestDTO,
    AdjustProductStockApplicationResponseDTO
> {

    constructor(
        private readonly eventPublisher: IEventPublisher,
        private readonly commandProductRepository:ICommandProductRepository,
        private readonly queryProductRepository:IQueryProductRepository,
    ){
        super()
    }
    async execute(command: AdjustProductStockApplicationRequestDTO): Promise<Result<AdjustProductStockApplicationResponseDTO>> {

        const products:Product[]=[]

        for (const dataproduct of command.products){

            let search=await this.queryProductRepository.findProductById(
                ProductID.create(dataproduct.id)
            )
    
            if (!search.isSuccess())
                return Result.fail(new NotFoundProductApplicationException())
    
            products.push(search.getValue)
        }

        for (const product of products){
            product.reduceQuantiy(
                command.products.find(p=>product.getId().equals(ProductID.create(p.id))).quantity
            )
        }

        for( const product of products){
            let updateResponse= await this.commandProductRepository.updateProduct(product)
        
            if (!updateResponse.isSuccess())
                return Result.fail(updateResponse.getError)
        }

        for (const product of products){
            await this.eventPublisher.publish(product.pullDomainEvents())
        }

        return Result.success({
            ...command
        })
    }

}