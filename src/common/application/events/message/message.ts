export abstract class Message {
	private ocurredOn: Date;
	private messageName: string;

	protected constructor() {
		this.ocurredOn = new Date();
		this.messageName = this.constructor.name;
	}

	get getOcurredOn(): Date {
		return this.ocurredOn;
	}

	get getmessageName(): string {
		return this.messageName;
	}

	abstract serialize(): string;
}
