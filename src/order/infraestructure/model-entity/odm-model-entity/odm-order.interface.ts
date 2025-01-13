export interface IOdmOrderModel{
    id: string;
    state: string;
    createdDate: Date;
    totalAmount: number;
    currency: string;
    latitude: number;
    longitude: number;
    receivedDate?: Date;
}
