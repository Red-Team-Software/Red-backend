export interface IUserWalletBalanceAdded {
    userId: string;
    userWallet:{
        amount: number;
        currency: string;
    }
}