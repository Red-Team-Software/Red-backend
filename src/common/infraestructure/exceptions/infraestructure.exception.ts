import { ExeptionType } from ".";

export abstract class InfraesctructureException extends Error {
	protected type: ExeptionType;
	constructor(msg: string) {
		super(msg);
		this.type=ExeptionType.NOT_REGISTERED
		// Object.setPrototypeOf(this, InfraesctructureException.prototype);
	}

	public getType(): ExeptionType {
		return this.type;
	}
}
