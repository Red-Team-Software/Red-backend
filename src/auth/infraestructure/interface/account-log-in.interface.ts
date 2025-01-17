export interface IAccountLogIn  {
    id:string
    session: {
        id: string;
        expired_at: Date;
        push_token: string;
        accountId: string;
    }
}