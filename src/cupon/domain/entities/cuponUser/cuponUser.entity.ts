import { Entity } from "src/common/domain";
import { CuponUserId } from "./value-objects/cuponUserId";
import { UserId } from "src/user/domain/value-object/user-id";
import { CuponId } from "../../value-object/cupon-id";
import { CuponDiscount } from "../../value-object/cupon-discount";
import { CuponUserStateEnum } from "./value-objects/cupon-state-enum";
import { CuponCode } from "../../value-object/cupon-code";

export class CuponUser extends Entity<CuponUserId> {
    private state:CuponUserStateEnum
    private userId: UserId;
    private cuponId: CuponId;
    private discount: CuponDiscount;

    private constructor(
        private cuponUserId: CuponUserId,
        userId: UserId,
        cuponId: CuponId,
        discount: CuponDiscount,
        state:CuponUserStateEnum
    ) {
        super(cuponUserId);
        this.userId = userId;
        this.cuponId = cuponId;
        this.discount = discount;
        this.state = state;
    }

    static create(
        cuponUserId: CuponUserId,
        userId: UserId,
        cuponId: CuponId,
        discount: CuponDiscount,
        state:CuponUserStateEnum
    ): CuponUser {
        return new CuponUser(cuponUserId, userId, cuponId, discount, state);
    }

    public markAsUsed(): void {
        this.state = CuponUserStateEnum.create('USED');
    }

    public isCuponUsed(): boolean {
        return this.state.equals(CuponUserStateEnum.create('USED'));
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

    get State(): CuponUserStateEnum{
        return this.state
    }
}
