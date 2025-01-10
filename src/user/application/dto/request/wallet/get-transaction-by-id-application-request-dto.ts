import { IServiceRequestDto } from 'src/common/application/services';


export interface GetTransactionByIdApplicationRequestDTO extends IServiceRequestDto{
    userId: string;
    transactionId: string;
}