import { Entity } from "src/common/domain";
import { CuponId } from "src/cupon/domain/value-object/cupon-id";
import { CuponState } from "./value-objects/cupon-state";

export class UserCoupon extends Entity<CuponId> {
    
    constructor(
        cuponId: CuponId,
        private readonly cuponState:CuponState
    ) {
        super(cuponId);
    }

    static create(
        cuponId: CuponId,
        cuponState:CuponState
    ): UserCoupon {
        return new UserCoupon(
            cuponId,
            cuponState
        )
    }

    get CuponState():CuponState{return this.cuponState}

    

}