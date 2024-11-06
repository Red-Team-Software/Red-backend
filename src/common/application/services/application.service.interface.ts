import { Result } from "src/common/utils/result-handler/result";
import { IServiceRequestDto } from "./dto/request/service-request-dto.interface";
import { IServiceResponseDto } from "./dto/response/service-response-dto.interface";

export abstract class IApplicationService<
	I extends IServiceRequestDto,
	O extends IServiceResponseDto,
> {
	get name() {
		return this.constructor.name;
	}

	abstract execute(data: I): Promise<Result<O>>; //Acción singular que realiza el servicio
}
