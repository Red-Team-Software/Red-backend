import { IServiceResponseDto } from "src/common/application/services/dto/response/service-response-dto.interface";

export type productsOrderByIdResponse = {
    id: string
    name: string 
    description: string
    quantity: number
    price:number 
    images:string[]
    currency:string
}

export type bundlesOrderByIdResponse = {
    id: string
    name: string 
    description: string
    quantity: number
    price:number 
    images:string[]
    currency:string
}

export type reportOrderByIdResponse = {
    description: string
}

export type courierOrderByIdResponse = {
    courierName: string
    courierImage: string
    phone: string
}

export type orderByIdResponse = {
    orderId: string;
    orderState: {
        state: string;
        date: Date;
    }[]
    orderTimeCreated: string;
    totalAmount: number;
    subTotal: number;
    orderReceivedDate?: Date;
    orderPayment?: {
        paymetAmount: number;
        paymentCurrency: string;
        paymentMethod: string;
    };
    orderDirection: {
        lat: string;
        long: string;
    };
    //orderDirection: string;
    products?: productsOrderByIdResponse[];
    bundles?: bundlesOrderByIdResponse[];
    orderReport?: reportOrderByIdResponse;
    orderCourier?: courierOrderByIdResponse;
}

export class FindOrderByIdResponseDto implements IServiceResponseDto {
    
    constructor(
        readonly orders: orderByIdResponse
    ){
        
    }

}