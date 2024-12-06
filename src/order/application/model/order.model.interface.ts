export interface IOrderModel{
    orderId: string;
    orderState: string;
    orderCreatedDate: Date;
    orderTimeCreated: string;
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
    products?: productsOrderResponse[];
    bundles?: bundlesOrderResponse[];
    orderReport?: reportOrderResponse;
    orderCourier: courierOrderResponse;
}

export interface productsOrderResponse {
    id: string
    name: string 
    descripcion: string
    quantity: number
    price:number 
    images:string[]
    currency:string
    orderid: string
}

export interface bundlesOrderResponse {
    id: string
    name: string 
    descripcion: string
    quantity: number
    price:number 
    images:string[]
    currency:string
    orderid: string
}

export interface reportOrderResponse {
    id: string
    description: string
    orderid: string
}

export interface courierOrderResponse {
    courierName: string
    courierImage: string
}