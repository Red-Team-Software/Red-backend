export interface UserCouponAplied {
    userId:string,
    coupons: {
        id: string;
        state: string;
    }
}