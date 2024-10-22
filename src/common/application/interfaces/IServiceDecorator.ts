import { Result } from "src/common/utils/result-handler/result";
import { IService, IServiceRequestDto, IServiceResponseDto } from "./IService";

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
