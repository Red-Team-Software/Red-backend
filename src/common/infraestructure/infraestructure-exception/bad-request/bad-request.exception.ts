import { ExeptionInfraestructureType } from "../enum/exceptions-infraestructure-type.enums";
import { InfraesctructureException } from "../infraestructure-exception/infraestructure.exception";

export class BadRequestException extends InfraesctructureException {
	constructor() {
		super('Bad request error');
		this.infraestructureType = ExeptionInfraestructureType.BAD_REQUEST;
	}
}
