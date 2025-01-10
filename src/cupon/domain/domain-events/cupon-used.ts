import { DomainEvent } from "../../../common/domain/domain-event/domain-event";
import { CuponId } from "../value-object/cupon-id";
import { CuponDiscount } from "../value-object/cupon-discount";
import { CuponUserId } from "../entities/cuponUser/value-objects/cuponUserId";

export class CuponUsed extends DomainEvent {
    serialize(): string {
        const data = {
            CuponUserId: this.cuponUserId.Value,
            userId: this.userId.Value,
            cuponId: this.cuponId.Value,
            cuponDiscount: this.cuponDiscount.Value
        };

        return JSON.stringify(data);
    }

    static create(cuponUserId: CuponUserId, userId: CuponUserId, cuponId: CuponId, cuponDiscount: CuponDiscount) {
        return new CuponUsed(
            cuponUserId,
            userId,
            cuponId,
            cuponDiscount
        );
    }

    constructor( private cuponUserId: CuponUserId, private userId: CuponUserId, private cuponId: CuponId, private cuponDiscount: CuponDiscount) {
        super();
    }
}