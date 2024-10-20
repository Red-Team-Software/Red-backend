import { Result } from "src/common/domain/result-handler/result";
import {
	IService,
	IServiceRequestDto,
	IServiceResponseDto,
} from "../interfaces/IService";
import { IServiceDecorator } from "../interfaces/IServiceDecorator";
import { IAsyncLogger } from "../ports/IAsyncLogger";

export class ServiceLoggerDecorator<
	I extends IServiceRequestDto,
	O extends IServiceResponseDto,
> extends IServiceDecorator<I, O> {
	private logger: IAsyncLogger;

	constructor(decoratee: IService<I, O>, logger: IAsyncLogger) {
		super(decoratee);
		this.logger = logger;
	}

	async execute(service: I): Promise<Result<O>> {
		let r = await this.decoratee.execute(service);

		if (r.isSuccess) {
			this.logger.writeToLog(
				`Time: ${new Date()} | Service: ${this.decoratee.name} | ${service.dataToString()} | ${r.getValue().dataToString()}`
			);
		}

		return r;
	}
}
