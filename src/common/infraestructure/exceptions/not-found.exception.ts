import { ExeptionType } from "./exceptions-type.enums";
import { InfraesctructureException } from "./infraestructure.exception";

export class NotFoundException extends InfraesctructureException {
	constructor(message: string) {
		super(message);
		this.type = ExeptionType.NOT_FOUND;
	}
}
