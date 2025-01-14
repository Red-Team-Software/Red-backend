import { IServiceResponseDto } from "src/common/application/services/dto/response/service-response-dto.interface";

export type productsOrderResponse = {
    id: string
    name: string 
    description: string
    quantity: number
    price:number 
    images:string[]
    currency:string
    orderid: string
}

export type bundlesOrderResponse = {
    id: string
    name: string 
    description: string
    quantity: number
    price:number 
    images:string[]
    currency:string
    orderid: string
}

export type reportOrderResponse = {
    id: string
    description: string
    orderid: string
}

export type courierOrderResponse = {
    courierName: string
    courierImage: string
    location: {
        lat: number
        long: number
    }
}

export type orderResponse = {
    id: string;
    last_state: {
        state: string;
        date: Date;
    };
    totalAmount: number;
    summary_order: string;
}

export class FindAllOrdersApplicationServiceResponseDto implements IServiceResponseDto {
    
    constructor(
        readonly orders: orderResponse[]
    ){
        
    }

}