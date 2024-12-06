import { IServiceRequestDto } from 'src/common/application/services';


export interface FindAllOrdersByUserApplicationServiceRequestDto extends IServiceRequestDto {    
    page?: number;
    perPage?: number;
}