export class Result<T> {
	private value?: T;
	private error?: Error;

	private constructor(value: T, error: Error) {
		this.value = value;
		this.error = error;
	}

	public getValue(): T {
		return this.value;
	}

	public getError(): Error {
		return this.error;
	}

	public isSuccess(): boolean {
		return !this.error;
	}

	public isFailure(): boolean {
		return !!this.error;
	}

	static success<T>(value: T): Result<T> {
		return new Result<T>(value, null);
	}

	static fail<T>(error: Error) {
		return new Result<T>(null, error);
	}
}
