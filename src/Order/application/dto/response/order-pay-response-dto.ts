import { IServiceResponseDto } from "src/common/application/services"

export interface OrderPayResponseDto extends IServiceResponseDto {
        id: string,
        orderState: string,
        orderCreatedDate: Date,
        totalAmount: number,
        currency: string,
        orderDirection: {
            lat: number,
            long: number
        },
        products: {
            id: string,
            quantity: number
            nombre:string 
            descripcion:string
            price:number 
            currency:string
            images:string[]
        }[],
        bundles: {
            id: string,
            quantity: number
            nombre:string 
            descripcion:string
            price:number 
            currency:string
            images:string[]
        }[],
        orderReceivedDate?: Date,
        orderPayment?: {
            amount: number,
            currency: string,
            paymentMethod: string
        }
}