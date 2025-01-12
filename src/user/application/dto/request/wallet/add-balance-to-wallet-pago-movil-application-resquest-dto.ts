import { IServiceRequestDto } from "src/common/application/services"

export interface AddBalancePagoMovilApplicationRequestDTO extends IServiceRequestDto{
    userId: string;
    amount:number;
    currency:string
    paymentId:string;
    date:Date
}