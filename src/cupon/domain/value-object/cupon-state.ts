import { ValueObject } from "src/common/domain";
import { InvalidCuponStateException } from "../domain-exceptions/invalid-cupon-state-exception";
import { CouponStateEnum } from "./enum/coupon.state.enum";
import { CuponAlreadyUnavaleableException } from "../domain-exceptions/cupon-already-unavaleable-exception";

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

    public validateState(): void {
        if (this.state === CouponStateEnum.unavaleable)
            throw new CuponAlreadyUnavaleableException();
    }
}
