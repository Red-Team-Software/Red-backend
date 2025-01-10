import { IServiceResponseDto } from 'src/common/application/services';
import { ITypeTransaction } from 'src/user/application/types/transaction-type';


export class GetAllTransactionsApplicationResponseDTO implements IServiceResponseDto{
    
    constructor(
        readonly transactions: ITypeTransaction[]
    ) {}
}