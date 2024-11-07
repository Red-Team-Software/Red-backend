import { BaseException } from "../base-exception";

export class Result<T> {
	private value?: T;
	private error?: BaseException;

	private constructor(value: T, error: BaseException) {
		this.value = value;
		this.error = error;
	}

	get getValue(): T {
		return this.value;
	}

	get getError(): BaseException {
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

	static fail<T>(error: BaseException) {
		return new Result<T>(null, error);
	}
}
