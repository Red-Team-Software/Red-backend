import { ValueObject } from "src/common/domain";
import { InvalidCuponIdException } from "../domain-exceptions/invalid-cupon-id-exception";

export class CuponId implements ValueObject<CuponId> {
    private readonly id: string;

    equals(valueObject: CuponId): boolean {
        return this.Value === valueObject.Value;
    }

    get Value() {
        return this.id;
    }

    static create(id: string): CuponId {
        return new CuponId(id);
    }

    private constructor(id: string) {
        const regex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$');
        if (!regex.test(id)) {
            throw new InvalidCuponIdException();
        }
        this.id = id;
    }
}
