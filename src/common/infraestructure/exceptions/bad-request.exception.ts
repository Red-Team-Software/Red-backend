import { ExeptionType } from "./exceptions-type.enums";
import { InfraesctructureException } from "./infraestructure.exception";

export class BadRequestException extends InfraesctructureException {
	constructor(message: string) {
		super(message);
		this.type = ExeptionType.BAD_REQUEST;
	}
}
