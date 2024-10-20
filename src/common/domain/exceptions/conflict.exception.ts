import { ExeptionType } from "./";
import { Exception } from "./exception";

export class ConflictException extends Exception {
	constructor(message: string) {
		super(message);
		this.type = ExeptionType.CONFLICT;
	}
}
