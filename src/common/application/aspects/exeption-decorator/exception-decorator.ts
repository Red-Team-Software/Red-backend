import { Result } from "src/common/utils/result-handler/result";
import { IServiceDecorator } from "../../services/decorator/IServiceDecorator";
import { ExceptionMapper } from "src/common/infraestructure/exeption-mapper/exception-mapper";
import { IServiceRequestDto, IServiceResponseDto } from "../../services";

export class ExceptionDecorator<
	I extends IServiceRequestDto,
	O extends IServiceResponseDto,
> extends IServiceDecorator<I, O> {
	async execute(input: I): Promise<Result<O>> {
		try {
			const res = await this.decoratee.execute(input);
			if (!res.isSuccess()) {
				throw ExceptionMapper.toHttp(res.getError);
			}
			return res;
		} catch (error) {
			throw ExceptionMapper.toHttp(error);
		}
	}
}
