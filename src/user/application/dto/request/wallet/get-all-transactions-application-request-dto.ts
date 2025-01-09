import { IServiceRequestDto } from 'src/common/application/services';


export interface GetAllTransactionsApplicationRequestDTO extends IServiceRequestDto{
    userId: string;
    page: number;
    perPage: number;
}