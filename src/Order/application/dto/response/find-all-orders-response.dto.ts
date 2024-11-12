import { IServiceResponseDto } from "src/common/application/services"
import { Order } from "src/Order/domain/aggregate/order";

export type order = {
    orderId: string;
    orderState: string;
    orderCreatedDate: Date;
    totalAmount: number;
    orderReciviedDate?: Date;
    orderPayment?: {
        paymetAmount: number;
        paymentCurrency: string;
        payementMethod: string;
    };
    //orderDirection: OrderDirection;
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