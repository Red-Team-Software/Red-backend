import { IServiceRequestDto, IServiceResponseDto } from "src/common/application/services"

export interface AddBalanceZelleApplicationRequestDTO extends IServiceRequestDto{
    userId: string;
    amount:number;
    reference:string;
    date?:Date;
}