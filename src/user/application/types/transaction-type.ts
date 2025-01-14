export type ITypeTransaction = {
    id:string,
    currency:string,
    price: number,
    walletId: string,
    paymentMethod?: {
        id: string,
        name: string,
    },
    date: Date,
}