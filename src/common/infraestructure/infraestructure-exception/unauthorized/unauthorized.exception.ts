import { ExeptionInfraestructureType } from "../enum/exceptions-infraestructure-type.enums";
import { InfraesctructureException } from "../infraestructure-exception/infraestructure.exception";

export class UnauthorizedException extends InfraesctructureException {
	constructor(message: string) {
		super(message);
		this.infraestructureType = ExeptionInfraestructureType.UNAUTHORIZED;
	}
}
