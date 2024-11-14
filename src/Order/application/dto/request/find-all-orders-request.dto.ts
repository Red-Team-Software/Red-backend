import { IServiceRequestDto } from 'src/common/application/services';


export interface FindAllOrdersApplicationServiceRequestDto extends IServiceRequestDto {
    userId: string;
    
    page?: number;
    perPage?: number;
}