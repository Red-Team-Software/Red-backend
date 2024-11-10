import { IServiceResponseDto } from "src/common/application/services"

export class OrderPayResponseDto implements IServiceResponseDto {
    
    name: string;
    description: string;
    caducityDate: Date;
    stock: number;
    images:Buffer[];
    price:number;

}