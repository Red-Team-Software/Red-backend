import { ValueObject } from "src/common/domain";
import { InvalidCuponDiscountException } from "../domain-exceptions/invalid-cupon-discount-exception";

export class CuponDiscount implements ValueObject<CuponDiscount> {
    private readonly discount: number;

    equals(valueObject: CuponDiscount): boolean {
        return this.Value === valueObject.Value;
    }

    get Value() {
        return this.discount;
    }

    static create(discount: number): CuponDiscount {
        return new CuponDiscount(discount);
    }

    private constructor(discount: number) {
        if (discount <= 0 || discount > 1) throw new InvalidCuponDiscountException();
        this.discount = discount;
    }
}
