import { ExeptionType } from "./";
import { Exception } from "./exception";

export class NotFoundException extends Exception {
	constructor(message: string) {
		super(message);
		this.type = ExeptionType.NOT_FOUND;
	}
}
