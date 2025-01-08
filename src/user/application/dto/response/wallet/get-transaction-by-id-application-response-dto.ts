import { IServiceResponseDto } from 'src/common/application/services';
import { ITypeTransaction } from 'src/user/application/types/transaction-type';


export interface GetTransactionByIdApplicationResponseDTO extends IServiceResponseDto{
    transactions: ITypeTransaction;

}