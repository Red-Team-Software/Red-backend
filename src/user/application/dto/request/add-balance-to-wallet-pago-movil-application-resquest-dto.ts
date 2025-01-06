import { IServiceResponseDto } from "src/common/application/services"

export interface AddBalancePagoMovilApplicationRequestDTO extends IServiceResponseDto{
    userId: string;
    phone:string;
    cedula:string;
    bank:string;
    amount:number;
    reference:string;
    date?:Date;
}