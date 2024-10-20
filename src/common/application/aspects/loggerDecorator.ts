import { Result } from "src/common/domain/result-handler/result";
import {
	IService,
	IServiceRequestDto,
	IServiceResponseDto,
} from "../interfaces/IService";
import { IServiceDecorator } from "../interfaces/IServiceDecorator";
import { ILogger } from "../logger/logger.interface";

export class LoggerDecorator<
	I extends IServiceRequestDto,
	O extends IServiceResponseDto,
> extends IServiceDecorator<I, O> {
	private readonly logger: ILogger;

	constructor(decoratee: IService<I, O>, logger: ILogger) {
		super(decoratee);
		this.logger = logger;
	}

	async execute(input: I): Promise<Result<O>> {
		const r = await this.decoratee.execute(input);

		if (!r.isSuccess) {
			// Adaptar esto a loggear por texto no es tan complejo, me parece raro que sea solo loggear por consola
			this.logger.errorLog(
				this.decoratee.name,
				`Error execute: Error: ${r.getError()} -- `,
				input.dataToString()
			);
		} else {
			this.logger.successLog(
				this.decoratee.name,
				`Successful execute: -- `,
				input.dataToString()
			);
		}

		return r;
	}
}
