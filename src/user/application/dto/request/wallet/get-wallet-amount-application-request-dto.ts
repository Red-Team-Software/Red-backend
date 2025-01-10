import { IServiceRequestDto } from 'src/common/application/services';


export interface WalletAmountApplicationRequestDTO extends IServiceRequestDto{
    userId: string;
}