import { Result } from "src/common/utils/result-handler/result"
import { IServiceRequestDto, IServiceResponseDto, IApplicationService, IServiceDecorator } from "../../services"
import { ILogger } from "../../logger/logger.interface"
import { ITimer } from "../../timer/timer.interface"


export class PerformanceDecorator <
        I extends IServiceRequestDto,
        O extends IServiceResponseDto
> 
extends IServiceDecorator <I,O>{
    constructor ( 
        applicationService: IApplicationService<I, O>,
        private readonly timer: ITimer,
        private readonly logger: ILogger,
    ) {
        super(applicationService)
    }

    async execute ( input: I ): Promise<Result<O>> {
        let beginingTime=performance.now()
        let result= await this.decoratee.execute( input )
        let endingTime=performance.now()
        let time=endingTime-beginingTime
		if (!result.isSuccess()) 
			this.logger.errorLog(
				this.decoratee.name,
				`Error execute: Error: ${result.getError} -- +`,
				time.toString()
			)
		 else 
			this.logger.successLog(
				this.decoratee.name,
				`Successful execute: -- +`,
				time.toString()
			);
        return result
    }
}