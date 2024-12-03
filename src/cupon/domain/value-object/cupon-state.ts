import { ValueObject } from "src/common/domain";
import { InvalidCuponStateException } from "../domain-exceptions/invalid-cupon-state-exception";

export class CuponState implements ValueObject<CuponState> {
    private readonly state: boolean;

    equals(valueObject: CuponState): boolean {
        return this.Value === valueObject.Value;
    }

    get Value() {
        return this.state;
    }

    static create(state: boolean): CuponState {
        return new CuponState(state);
    }

    private constructor(state: boolean) {
        if (state === null || state === undefined) throw new InvalidCuponStateException();
        this.state = state;
    }
}
