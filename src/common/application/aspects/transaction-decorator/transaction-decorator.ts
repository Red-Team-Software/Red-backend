import { Result } from "src/common/utils/result-handler/result"
import { IServiceRequestDto, IServiceResponseDto, IApplicationService, IServiceDecorator } from "../../services"
import { ITransactionHandler } from "src/common/domain"


export class TransactionDecorator <
        I extends IServiceRequestDto,
        O extends IServiceResponseDto
> 
extends IServiceDecorator <I,O>{
    constructor ( 
        applicationService: IApplicationService<I, O>,
        private readonly transactionHandler: ITransactionHandler
    ) {
        super(applicationService)
    }

    async execute ( input: I ): Promise<Result<O>> {
        try{
            await this.transactionHandler.startTransaction()
            let result = await this.decoratee.execute(input)
            if(result.isSuccess()) 
                await this.transactionHandler.commitTransaction()
            else{
                await this.transactionHandler.rollbackTransaction()
            }
            return result
        }catch(e){
            await this.transactionHandler.rollbackTransaction()
            throw e
        }

    }
}