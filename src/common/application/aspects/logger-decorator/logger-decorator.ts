import { Result } from "src/common/utils/result-handler/result";
import { IServiceDecorator } from "../../services/decorator/IServiceDecorator";
import { ILogger } from "../../logger/logger.interface";
import { IServiceRequestDto, IServiceResponseDto } from "../../services";
import { IApplicationService } from "../../services/application.service.interface";

export class LoggerDecorator<
	I extends IServiceRequestDto,
	O extends IServiceResponseDto,
> extends IServiceDecorator<I, O> {
	private readonly logger: ILogger;

	constructor(decoratee: IApplicationService<I, O>, logger: ILogger) {
		super(decoratee);
		this.logger = logger;
	}

	async execute(input: I): Promise<Result<O>> {
		const r = await this.decoratee.execute(input);
		if (!r.isSuccess()) {
			this.logger.errorLog(
				this.decoratee.name,
				`Error execute: Error: ${r.getError} -- `,
				JSON.stringify(input)
			);
		} else {
			this.logger.successLog(
				this.decoratee.name,
				`Successful execute: -- `,
				JSON.stringify(input)
			);
		}
		return r;
	}
}
