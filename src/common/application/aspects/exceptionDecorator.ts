import { Result } from "src/common/utils/result-handler/result";
import {
	IServiceRequestDto,
	IServiceResponseDto,
} from "../interfaces/IService";
import { IServiceDecorator } from "../interfaces/IServiceDecorator";
import { ExceptionMapper } from "src/common/infraestructure/mappers/exception-mapper";
import { Exception } from "src/common/domain/exceptions";

export class ExceptionDecorator<
	I extends IServiceRequestDto,
	O extends IServiceResponseDto,
> extends IServiceDecorator<I, O> {
	async execute(input: I): Promise<Result<O>> {
		try {
			const res = await this.decoratee.execute(input);
			// No es success
			if (!res.isSuccess()) {
				// Si el error es de dominio
				if (res.getError() instanceof Exception) {
					throw ExceptionMapper.toHttp(res.getError() as Exception);
				}
			}
			return res;
		} catch (error) {
			throw ExceptionMapper.toHttp(error as Exception);
		}
	}
}
