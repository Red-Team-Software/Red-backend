export interface IOrderInterface {
    id: string;
    orderCreatedDate: Date;
    orderReciviedDate?: Date;
    totalAmount: number;
}