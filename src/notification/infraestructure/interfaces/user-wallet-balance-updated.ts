export interface IUserWalletBalanceUpdated {
    userId: string;
    userWallet:{
        amount: number;
        currency: string;
    }
}