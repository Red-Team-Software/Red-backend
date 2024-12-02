import { Result } from "src/common/utils/result-handler/result";
import { IServiceDecorator } from "../../services/decorator/IServiceDecorator";
import { ExceptionMapper } from "src/common/infraestructure/exeption-mapper/exception-mapper";
import { IServiceRequestDto, IServiceResponseDto } from "../../services";
import { BaseExceptionEnum } from "src/common/utils/enum/base-exception.enum";

export class ExceptionDecorator<
	I extends IServiceRequestDto,
	O extends IServiceResponseDto,
> extends IServiceDecorator<I, O> {
	async execute(input: I): Promise<Result<O>> {
		try {
			const res = await this.decoratee.execute(input);
			if (!res.isSuccess()) {
				ExceptionMapper.toHttp(res.getError,res.getError.message);
			}
			return res;
		} catch (error) {
			console.log("El error del decoradorado es ",error);
			if (error.Type==BaseExceptionEnum.DOMAIN_EXCEPTION)
				ExceptionMapper.toHttp(error,error.message);
			throw error
		}
	}
}
