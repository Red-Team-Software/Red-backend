import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract"
import { IApplicationService } from "src/common/application/services"
import { Result } from "src/common/utils/result-handler/result"
import { ICommandBundleRepository } from "src/bundle/domain/repository/bundle.command.repository.interface"
import { IQueryBundleRepository } from "../../query-repository/query-bundle-repository"
import { AdjustBundleStockApplicationRequestDTO } from "../../dto/request/adjust-bundle-stock-application-request-dto"
import { AdjustBundleStockApplicationResponseDTO } from "../../dto/response/adjust-bundle-stock-application-response-dto"
import { BundleId } from "src/bundle/domain/value-object/bundle-id"
import { NotFoundBundleApplicationException } from "../../application-exception/not-found-bundle-application-exception"
import { Bundle } from "src/bundle/domain/aggregate/bundle.aggregate"


export class AdjustBundleStockApplicationService extends IApplicationService 
<
    AdjustBundleStockApplicationRequestDTO,
    AdjustBundleStockApplicationResponseDTO
> {

    constructor(
        private readonly eventPublisher: IEventPublisher,
        private readonly commandBundleRepository:ICommandBundleRepository,
        private readonly queryBundleRepository:IQueryBundleRepository,
    ){
        super()
    }
    async execute(command: AdjustBundleStockApplicationRequestDTO): Promise<Result<AdjustBundleStockApplicationResponseDTO>> {

        const bundles:Bundle[]=[]

        for (const databundle of command.bundles){

            let search=await this.queryBundleRepository.findBundleById(
                BundleId.create(databundle.id)
            )
    
            if (!search.isSuccess())
                return Result.fail(new NotFoundBundleApplicationException())
    
            bundles.push(search.getValue)
        }

        for (const bundle of bundles){
            bundle.reduceQuantiy(
                command.bundles.find(p=>bundle.getId().equals(BundleId.create(p.id))).quantity
            )
        }

        for( const bundle of bundles){
            let updateResponse= await this.commandBundleRepository.updateBundle(bundle)
        
            if (!updateResponse.isSuccess())
                return Result.fail(updateResponse.getError)
        }

        for (const bundle of bundles){
            await this.eventPublisher.publish(bundle.pullDomainEvents())
        }

        return Result.success({
            ...command
        })
    }

}