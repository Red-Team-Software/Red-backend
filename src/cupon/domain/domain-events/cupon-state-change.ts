import { DomainEvent } from "../../../common/domain/domain-event/domain-event";
import { CuponId } from "../value-object/cupon-id";
import { CuponState } from "../value-object/cupon-state";

export class CuponStateChanged extends DomainEvent {
    serialize(): string {
        const data = {
            cuponId: this.cuponId.Value,
            cuponState: this.cuponState.Value,
        };

        return JSON.stringify(data);
    }

    static create(cuponId: CuponId, cuponState: CuponState) {
        return new CuponStateChanged(cuponId, cuponState);
    }

    constructor(
        public cuponId: CuponId,
        public cuponState: CuponState
    ) {
        super();
    }
}
