import { ValueObject } from "src/common/domain";
import { InvalidCuponCodeException } from "../domain-exceptions/invalid-cupon-code-exception";

export class CuponCode implements ValueObject<CuponCode> {
    private readonly code: string;

    equals(valueObject: CuponCode): boolean {
        return this.Value === valueObject.Value;
    }

    get Value() {
        return this.code;
    }

    static create(code: string): CuponCode {
        return new CuponCode(code);
    }

    private constructor(code: string) {
        if (!code || code.trim().length < 5) throw new InvalidCuponCodeException();
        this.code = code;
    }
}
