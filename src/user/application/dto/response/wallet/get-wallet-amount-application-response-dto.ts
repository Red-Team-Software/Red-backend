import { IServiceResponseDto } from 'src/common/application/services';


export interface WalletAmountApplicationResponseDTO extends IServiceResponseDto{
    amount: number;
    currency: string;
}