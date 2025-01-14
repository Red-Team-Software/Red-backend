import { IServiceRequestDto } from "src/common/application/services"

export interface AddUserCouponApplicationRequestDTO extends IServiceRequestDto{
    idCoupon:string
}