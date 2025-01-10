import { IServiceResponseDto } from "src/common/application/services/dto/response/service-response-dto.interface";

export type productsOrderByIdResponse = {
    id: string
    name: string 
    description: string
    quantity: number
    price:number 
    images:string[]
    currency:string
    orderid: string
}

export type bundlesOrderByIdResponse = {
    id: string
    name: string 
    description: string
    quantity: number
    price:number 
    images:string[]
    currency:string
    orderid: string
}

export type reportOrderByIdResponse = {
    id: string
    description: string
    orderid: string
}

export type courierOrderByIdResponse = {
    courierName: string
    courierImage: string
    location: {
        lat: number
        long: number
    }
}

export type orderByIdResponse = {
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
    //orderDirection: string;
    products?: productsOrderByIdResponse[];
    bundles?: bundlesOrderByIdResponse[];
    orderReport?: reportOrderByIdResponse;
    orderCourier: courierOrderByIdResponse;
}

export class FindOrderByIdResponseDto implements IServiceResponseDto {
    
    constructor(
        readonly orders: orderByIdResponse
    ){
        
    }

}