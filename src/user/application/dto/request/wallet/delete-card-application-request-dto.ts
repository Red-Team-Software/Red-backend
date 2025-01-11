import { IServiceRequestDto } from 'src/common/application/services';


export interface DeleteCardApplicationRequestDTO extends IServiceRequestDto{
    userId: string;
    cardId: string;
}