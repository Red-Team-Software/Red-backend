import { IServiceResponseDto } from "src/common/application/services";


export interface AddBalanceZelleApplicationResponseDTO extends IServiceResponseDto{
    success:boolean;
    message:string;
}