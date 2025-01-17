export interface IUserRegistered{
    userId: string;
    userName: string;
    userPhone: string;
    wallet: {
        walletId: string;
        ballance: {
            currency: string;
            amount: number;
        };
    };
    coupons: {
        id: string;
        state: string;
    }[];
    userImage: string;
    userRole: string       
}
