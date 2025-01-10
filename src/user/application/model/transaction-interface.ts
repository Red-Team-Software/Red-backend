export interface ITransaction{
    id:string,
    currency:string,
    price: number,
    wallet_id: string,
    payment_method_id?: string
    date: Date,
}