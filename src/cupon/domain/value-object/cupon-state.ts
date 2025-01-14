import { ValueObject } from "src/common/domain";
import { InvalidCuponStateException } from "../domain-exceptions/invalid-cupon-state-exception";
import { CouponStateEnum } from "./enum/coupon.state.enum";

export class CuponState implements ValueObject<CuponState> {
    private readonly state: string;

    equals(valueObject: CuponState): boolean {
        return this.Value === valueObject.Value;
    }

    get Value() {
        return this.state;
    }

    static create(state: string): CuponState {
        return new CuponState(state);
    }

    private constructor(state: string) {
        if (!CouponStateEnum[state]) 
            throw new InvalidCuponStateException(state);
        this.state = state;
    }
}
