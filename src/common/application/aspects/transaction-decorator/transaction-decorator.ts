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
            console.log('empezo')
            await this.transactionHandler.startTransaction()
            let result = await this.decoratee.execute(input)
            if(result.isSuccess()) 
                await this.transactionHandler.commitTransaction()
            else{
                console.log('fallo')
                await this.transactionHandler.rollbackTransaction()
            }
            console.log('termino')
            return result
        }catch(e){
            console.log('fallo',e)
            await this.transactionHandler.rollbackTransaction()
            throw e
        }

    }
}