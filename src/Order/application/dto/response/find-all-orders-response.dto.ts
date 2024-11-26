import { IServiceResponseDto } from "src/common/application/services/dto/response/service-response-dto.interface";


export type productsOrderResponse = {
    id: string
    name: string 
    descripcion: string
    quantity: number
    price:number 
    images:string[]
    currency:string
    orderid: string
}

export type bundlesOrderResponse = {
    id: string
    name: string 
    descripcion: string
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

export type orderResponse = {
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
        lng: number;
    };
    //orderDirection: string;
    products?: productsOrderResponse[];
    bundles?: bundlesOrderResponse[];
    orderReport?: reportOrderResponse;
}

export class FindAllOrdersApplicationServiceResponseDto implements IServiceResponseDto {
    
    constructor(
        readonly orders: orderResponse[]
    ){
        
    }

}