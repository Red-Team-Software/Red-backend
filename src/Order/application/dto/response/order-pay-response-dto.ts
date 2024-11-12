import { IServiceResponseDto } from "src/common/application/services"

export class OrderPayResponseDto implements IServiceResponseDto {
    
    constructor(value: string){
        this.paymentState = value;
    }

    paymentState: string;

}