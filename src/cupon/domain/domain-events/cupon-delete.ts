import { DomainEvent } from "../../../common/domain/domain-event/domain-event";
import { CuponId } from "../value-object/cupon-id";

export class CuponDeleted extends DomainEvent {
    serialize(): string {
        const data = {
            cuponId: this.cuponId.Value,
        };

        return JSON.stringify(data);
    }

    static create(cuponId: CuponId) {
        return new CuponDeleted(cuponId);
    }

    constructor(public cuponId: CuponId) {
        super();
    }
}
