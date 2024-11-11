import { IServiceResponseDto } from "src/common/application/services"

export class OrderPayResponseDto implements IServiceResponseDto {
    
    constructor(value: boolean){
        this.paymentState = value;
    }

    paymentState: boolean;

}