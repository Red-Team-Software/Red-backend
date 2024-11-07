import { ExeptionType } from "./exceptions-type.enums";
import { InfraesctructureException } from "./infraestructure.exception";

export class PersistenceException extends InfraesctructureException {
	constructor(message: string) {
		super(message);
		this.type = ExeptionType.PERSISTENCE;
	}
}
