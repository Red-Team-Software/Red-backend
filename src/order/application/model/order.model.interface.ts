export interface IOrderModel{
    orderId: string;
    orderState: string;
    orderCreatedDate: Date;
    totalAmount: number;
    orderReceivedDate?: Date;
    orderPayment?: {
        paymetAmount: number;
        paymentCurrency: string;
        payementMethod: string;
    };
    orderDirection: {
        lat: number;
        long: number;
    };
    products?: productsOrderRes[];
    bundles?: bundlesOrderRes[];
    orderReport?: reportOrderResponse;
    orderCourier?: courierOrderResponse;
}

export interface productsOrderRes {
    id: string
    name: string 
    description: string
    quantity: number
    price:number 
    images:string[]
    currency:string
}

export interface bundlesOrderRes {
    id: string
    name: string 
    description: string
    quantity: number
    price:number 
    images:string[]
    currency:string
}

export interface reportOrderResponse {
    id: string
    description: string
}

export interface courierOrderResponse {
    courierId: string
    courierName: string
    courierImage: string
    location: {
        lat: number
        long: number
    }
}