import { Result } from "src/common/utils/result-handler/result";
import { IServiceDecorator } from "../../services/decorator/IServiceDecorator";
import { IAuditRepository } from "../../repositories/audit.repository";
import { IApplicationService, IServiceRequestDto, IServiceResponseDto } from "../../services";
import { IDateHandler } from "../../date-handler/date-handler.interface";

export class AuditDecorator<
	I extends IServiceRequestDto,
	O extends IServiceResponseDto,
> extends IServiceDecorator<I, O> {

	constructor(decoratee: IApplicationService<I, O>, 
		private audit: IAuditRepository,
		private date:IDateHandler
	){
		super(decoratee);
	}

	async execute(service: I): Promise<Result<O>> {
		let r = await this.decoratee.execute(service);

		if (r.isSuccess) {
			await this.audit.saveLog(
				"Time: " +
					this.date.currentDate() +
					" | Service: " +
					this.decoratee.name +
					" | InputData: " +
					JSON.stringify(service)+
					" | ResponseData: " +
					JSON.stringify(r.getValue)
			);
		}

		return r;
	}
}
