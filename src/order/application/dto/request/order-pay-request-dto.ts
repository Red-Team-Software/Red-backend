import { IServiceRequestDto } from "src/common/application/services"

export interface OrderPayApplicationServiceRequestDto extends IServiceRequestDto {
    userId: string;
    amount: number;
    currency: string;
    paymentMethod: string;
    stripePaymentMethod: string;
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