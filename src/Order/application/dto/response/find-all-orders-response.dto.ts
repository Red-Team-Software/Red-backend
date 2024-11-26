import { IServiceResponseDto } from "src/common/application/services/dto/response/service-response-dto.interface";


export type order = {
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
    // orderDirection: {
    //     lat: number;
    //     lng: number;
    // }
    //orderDirection: string;
    //products?: OrderProductId[];
    //bundles?: OrderBundleId[];
    //orderReport?: OrderReportId;
}

export class FindAllOrdersApplicationServiceResponseDto implements IServiceResponseDto {
    
    constructor(
        readonly orders: order[]
    ){
        
    }

}