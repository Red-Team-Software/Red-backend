import { DomainEvent } from "src/common/domain"
import { UserId } from "../value-object/user-id"
import { UserCoupon } from "../entities/coupon/user-coupon.entity"

export class UserCouponAplied extends DomainEvent {
    serialize(): string {
        let data= {  
            userId:this.userId.Value,
            coupons:{
                id:this.userCoupon.getId().Value,
                state:this.userCoupon.CuponState.Value
            }
        }
        return JSON.stringify(data)
    }
    static create(
        userId:UserId,
        userCoupon:UserCoupon
    ){
        return new UserCouponAplied(
            userId,
            userCoupon
        )
    }
    constructor(
        public userId:UserId,
        public userCoupon:UserCoupon
    ){
        super()
    }
}