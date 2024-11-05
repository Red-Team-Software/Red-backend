import { ExeptionType } from "./";
import { Exception } from "./exception";

export class BadRequestException extends Exception {
	constructor(message: string) {
		super(message);
		this.type = ExeptionType.BAD_REQUEST;
	}
}
