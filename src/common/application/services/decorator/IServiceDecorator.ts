import { Result } from "src/common/utils/result-handler/result";
import { IServiceRequestDto } from "../dto/request/service-request-dto.interface";
import { IServiceResponseDto } from "../dto/response/service-request-dto.interface";
import { IApplicationService } from "../application.service.interface";

export abstract class IServiceDecorator<
	I extends IServiceRequestDto,
	O extends IServiceResponseDto,
> implements IApplicationService<I, O>
{
	protected readonly decoratee: IApplicationService<I, O>;

	constructor(decoratee: IApplicationService<I, O>) {
		this.decoratee = decoratee;
	}

	get name() {
		return this.decoratee.name;
	}
	abstract execute(input: I): Promise<Result<O>>;
}
