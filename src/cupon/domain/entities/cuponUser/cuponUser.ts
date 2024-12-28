import { Entity } from "src/common/domain";
import { CuponUserId } from "./value-objects/cuponUserId";
import { UserId } from "src/user/domain/value-object/user-id";
import { CuponId } from "../../value-object/cupon-id";
import { CuponDiscount } from "../../value-object/cupon-discount";

export class CuponUser extends Entity<CuponUserId> {
    private isUsed: boolean;
    private userId: UserId;
    private cuponId: CuponId;
    private discount: CuponDiscount;

    constructor(
        private cuponUserId: CuponUserId,
        userId: UserId,
        cuponId: CuponId,
        discount: CuponDiscount,
        isUsed: boolean = false
    ) {
        super(cuponUserId);
        this.isUsed = isUsed;
        this.userId = userId;
        this.cuponId = cuponId;
        this.discount = discount;
    }

    static create(
        cuponUserId: CuponUserId,
        userId: UserId,
        cuponId: CuponId,
        discount: CuponDiscount,
        isUsed: boolean = false
    ): CuponUser {
        return new CuponUser(cuponUserId, userId, cuponId, discount, isUsed);
    }

    public markAsUsed(): void {
        this.isUsed = true;
    }

    public isCuponUsed(): boolean {
        return this.isUsed;
    }

    get CuponUserId(): CuponUserId {
        return this.cuponUserId;
    }

    get UserId(): UserId{
        return this.userId
    }

    get CuponId(): CuponId{
        return this.cuponId;
    }

    get Discount(): CuponDiscount{
        return this.discount
    }
}
