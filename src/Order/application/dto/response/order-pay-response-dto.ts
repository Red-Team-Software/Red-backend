import { IServiceResponseDto } from "src/common/application/services"

export class OrderPayResponseDto implements IServiceResponseDto {
    
    constructor(
        public id: string,
        public orderState: string,
        public orderCreatedDate: Date,
        public totalAmount: number,
        public currency: string,
        public orderDirection: {
            lat: number,
            long: number
        },
        public products?: {
            id: string,
            quantity: number
        }[],
        public bundles?: {
            id: string,
            quantity: number
        }[],
        public orderReciviedDate?: Date,
        public orderReport?: string,
        public orderPayment?: {
            amount: number,
            currency: string,
            paymentMethod: string
        }
    ){
    }

}