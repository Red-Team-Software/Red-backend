import { DomainEvent } from "../../../common/domain/domain-event/domain-event";
import { CuponId } from "../value-object/cupon-id";
import { CuponDiscount } from "../value-object/cupon-discount";
import { UserId } from "src/user/domain/value-object/user-id";

export class CuponUsed extends DomainEvent {
    serialize(): string {
        const data = {
            userId: this.userId.Value,
            cuponId: this.cuponId.Value,
            cuponDiscount: this.cuponDiscount.Value
        };

        return JSON.stringify(data);
    }

    static create(userId: UserId, cuponId: CuponId, cuponDiscount: CuponDiscount) {
        return new CuponUsed(
            userId,
            cuponId,
            cuponDiscount
        );
    }

    constructor(private userId: UserId, private cuponId: CuponId, private cuponDiscount: CuponDiscount) {
        super();
    }
}