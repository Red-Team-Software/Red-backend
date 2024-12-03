import { DomainEvent } from "../../../common/domain/domain-event/domain-event";
import { CuponId } from "../value-object/cupon-id";
import { CuponState } from "../value-object/cupon-state";

export class CuponStateChanged extends DomainEvent {
    serialize(): string {
        const data = {
            cuponId: this.cuponId.Value,
            newState: this.newState.Value,
        };

        return JSON.stringify(data);
    }

    static create(cuponId: CuponId, newState: CuponState) {
        return new CuponStateChanged(cuponId, newState);
    }

    constructor(
        public cuponId: CuponId,
        public newState: CuponState
    ) {
        super();
    }
}
