import { ExeptionInfraestructureType } from "../enum/exceptions-infraestructure-type.enums";
import { InfraesctructureException } from "../infraestructure-exception/infraestructure.exception";

export class ConflictException extends InfraesctructureException {
	constructor(message: string) {
		super(message);
		this.infraestructureType = ExeptionInfraestructureType.CONFLICT;
	}
}
