import { Result } from "src/common/utils/result-handler/result";
import { IServiceDecorator } from "../../services/decorator/IServiceDecorator";
import { IAuditRepository } from "../../repositories/audit.repository";
import { IApplicationService, IServiceRequestDto, IServiceResponseDto } from "../../services";

export class AuditDecorator<
	I extends IServiceRequestDto,
	O extends IServiceResponseDto,
> extends IServiceDecorator<I, O> {
	private logger: IAuditRepository;

	constructor(decoratee: IApplicationService<I, O>, logger: IAuditRepository) {
		super(decoratee);
		this.logger = logger;
	}

	async execute(service: I): Promise<Result<O>> {
		let r = await this.decoratee.execute(service);

		if (r.isSuccess) {
			await this.logger.saveLog(
				"Time: " +
					new Date() +
					" | Service: " +
					this.decoratee.name +
					" | InputData: " +
					JSON.stringify(service)+
					" | ResponseData: " +
					JSON.stringify
			);
		}

		return r;
	}
}
