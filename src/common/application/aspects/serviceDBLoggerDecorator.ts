import { Result } from "src/common/utils/result-handler/result";
import {
	IService,
	IServiceRequestDto,
	IServiceResponseDto,
} from "../interfaces/IService";
import { IServiceDecorator } from "../interfaces/IServiceDecorator";
import { IAuditRepository } from "../repositories/audit.repository";

export class ServiceDBLoggerDecorator<
	I extends IServiceRequestDto,
	O extends IServiceResponseDto,
> extends IServiceDecorator<I, O> {
	private logger: IAuditRepository;

	constructor(decoratee: IService<I, O>, logger: IAuditRepository) {
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
					service.dataToString() +
					" | ResponseData: " +
					r.getValue().dataToString()
			);
		}

		return r;
	}
}
