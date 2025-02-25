import { DomainEvent } from "../../../common/domain/domain-event/domain-event";
import { CuponId } from "../value-object/cupon-id";
import { CuponCode } from "../value-object/cupon-code";
import { CuponName } from "../value-object/cupon-name";
import { CuponDiscount } from "../value-object/cupon-discount";
import { CuponState } from "../value-object/cupon-state";

export class CuponRegistered extends DomainEvent {
    serialize(): string {
        const data = {
            cuponId: this.cuponId.Value,
            cuponName: this.cuponName.Value,
            cuponCode: this.cuponCode.Value,
            cuponDiscount: this.cuponDiscount.Value,
            cuponState: this.cuponState.Value,
        };

        return JSON.stringify(data);
    }

    static create(
        cuponId: CuponId,
        cuponName: CuponName,
        cuponCode: CuponCode,
        cuponDiscount: CuponDiscount,
        cuponState: CuponState
    ) {
        return new CuponRegistered(
            cuponId,
            cuponName,
            cuponCode,
            cuponDiscount,
            cuponState
        );
    }

    constructor(
        public cuponId: CuponId,
        public cuponName: CuponName,
        public cuponCode: CuponCode,
        public cuponDiscount: CuponDiscount,
        public cuponState: CuponState
    ) {
        super();
    }
}
