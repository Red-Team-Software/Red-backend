import { IServiceResponseDto } from "src/common/application/services"

export interface OrderPayResponseDto extends IServiceResponseDto {
        id: string,
        orderState: string,
        orderCreatedDate: Date,
        orderTimeCreated: string,
        totalAmount: number,
        currency: string,
        orderDirection: {
            lat: number,
            long: number
        },
        products: {
            id: string,
            quantity: number
            name:string 
            description:string
            price:number 
            currency:string
            images:string[]
        }[],
        bundles: {
            id: string,
            quantity: number
            name:string 
            description:string
            price:number 
            currency:string
            images:string[]
        }[],
        orderPayment?: {
            amount: number,
            currency: string,
            paymentMethod: string
        },
        orderCourier: {
            courierName: string,
            courierImage: string,
        },
        orderUserId: string
}