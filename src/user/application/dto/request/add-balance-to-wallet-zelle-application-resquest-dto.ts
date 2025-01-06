import { IServiceRequestDto, IServiceResponseDto } from "src/common/application/services"

export interface AddBalanceZelleApplicationRequestDTO extends IServiceRequestDto{
    userId: string;
    phone:string;
    cedula:string;
    bank:string;
    amount:number;
    reference:string;
    date?:Date;
}