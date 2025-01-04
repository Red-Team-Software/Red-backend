import { IServiceRequestDto } from 'src/common/application/services';


export interface FindAllOrdersApplicationServiceRequestDto extends IServiceRequestDto {    
    page?: number;
    perPage?: number;
}