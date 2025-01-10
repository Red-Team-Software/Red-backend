import { BaseException } from "src/common/utils/base-exception/base-exception";
import { ExeptionInfraestructureType } from "../enum/exceptions-infraestructure-type.enums";
import { BaseExceptionEnum } from "src/common/utils/enum/base-exception.enum";

export abstract class InfraesctructureException extends BaseException {
	protected infraestructureType: ExeptionInfraestructureType;
	constructor(msg: string) {
		super(msg);
		this.infraestructureType=ExeptionInfraestructureType.NOT_REGISTERED
		this.type=BaseExceptionEnum.INFRAESTRUCTURE_EXCEPTION
		// Object.setPrototypeOf(this, InfraesctructureException.prototype);
	}

	public getInfraestructureType(): ExeptionInfraestructureType {
		return this.infraestructureType;
	}
}
