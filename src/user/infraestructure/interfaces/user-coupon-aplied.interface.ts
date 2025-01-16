export interface IUserCouponAplied {
    userId:string,
    coupons: {
        id: string;
        state: string;
    }
}