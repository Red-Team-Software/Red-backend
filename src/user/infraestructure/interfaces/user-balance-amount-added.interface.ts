
export interface IUserBalanceAmountAdded {
    userId:string
    userWallet: {
        amount: number;
        currency: string;
    }
}
