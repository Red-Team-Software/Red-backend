import { ValueObject } from "src/common/domain";
import { InvalidCuponNameException } from "../domain-exceptions/invalid-cupon-name-exception";

export class CuponName implements ValueObject<CuponName> {
    private readonly name: string;

    equals(valueObject: CuponName): boolean {
        return this.Value === valueObject.Value;
    }

    get Value() {
        return this.name;
    }

    static create(name: string): CuponName {
        return new CuponName(name);
    }

    private constructor(name: string) {
        if (!name || name.trim().length < 3) throw new InvalidCuponNameException();
        this.name = name;
    }
}
