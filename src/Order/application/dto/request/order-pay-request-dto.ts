import { IServiceRequestDto } from "src/common/application/services"

export interface OrderPayApplicationServiceRequestDto extends IServiceRequestDto {
    userId: string;
    paymentId: string;
    currency: string;
    paymentMethod: string;
    address: string;
    products?: {
        id: string,
        quantity: number
    }[];
    bundles?: {
        id: string,
        quantity: number
    }[];
    

}