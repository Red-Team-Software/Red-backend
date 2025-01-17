export interface IUserBalanceAmountDecremented {
    userId:string
    userWallet: {
        amount: number;
        currency: string;
    }
}
