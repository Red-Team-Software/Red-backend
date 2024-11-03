import { Result } from "src/common/utils/result-handler/result";
import { IServiceRequestDto } from "../dto/request/service-request-dto.interface";
import { IServiceResponseDto } from "../dto/response/service-request-dto.interface";
import { IService } from "../IService";

export abstract class IServiceDecorator<
	I extends IServiceRequestDto,
	O extends IServiceResponseDto,
> implements IService<I, O>
{
	protected readonly decoratee: IService<I, O>;

	constructor(decoratee: IService<I, O>) {
		this.decoratee = decoratee;
	}

	get name() {
		return this.decoratee.name;
	}
	abstract execute(input: I): Promise<Result<O>>;
}
