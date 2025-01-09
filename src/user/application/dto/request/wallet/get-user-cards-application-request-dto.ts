import { IServiceRequestDto } from 'src/common/application/services';


export interface UserCardsApplicationRequestDTO extends IServiceRequestDto{
    userId: string;
}