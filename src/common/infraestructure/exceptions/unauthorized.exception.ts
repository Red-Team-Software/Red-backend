import { Exception } from "./exception";
import { ExeptionType } from "./exceptions-type.enums";

export class UnauthorizedException extends Exception {
	constructor(message: string) {
		super(message);
		this.type = ExeptionType.UNAUTHORIZED;
	}
}
