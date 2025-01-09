import { IServiceRequestDto } from 'src/common/application/services';


export interface SaveCardApplicationRequestDTO extends IServiceRequestDto{
    userId: string;
    cardId: string;
}