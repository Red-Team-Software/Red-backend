import { IServiceResponseDto } from "src/common/application/services/dto/response/service-response-dto.interface";

export type productsOrderResponse = {
    id: string
    nombre: string 
    description: string
    quantity: number
    price:number 
    images:string[]
    currency:string
    orderid: string
}

export type bundlesOrderResponse = {
    id: string
    nombre: string 
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
}

export type orderResponse = {
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
    products?: productsOrderResponse[];
    bundles?: bundlesOrderResponse[];
    orderReport?: reportOrderResponse;
    orderCourier: courierOrderResponse;
}

export class FindAllOrdersApplicationServiceResponseDto implements IServiceResponseDto {
    
    constructor(
        readonly orders: orderResponse[]
    ){
        
    }

}