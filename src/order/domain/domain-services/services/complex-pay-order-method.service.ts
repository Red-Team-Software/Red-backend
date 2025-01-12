import { Result } from "src/common/utils/result-handler/result";
import { Order } from "../../aggregate/order";
import { IPaymentMethodService } from "../interfaces/payment-method-interface";
import { PaymentFailedException } from "../../exception/domain-services/payment-failed-exception";

export class ComplexPayOrderMethod implements IPaymentMethodService{

    constructor(private readonly payments: IPaymentMethodService[]){}
    
    async createPayment(order: Order): Promise<Result<Order>>{
        for (const payment of this.payments){
            let response=await payment.createPayment(order)
            if (response.isSuccess())
                return response
        }
        return Result.fail(new PaymentFailedException())
    }
}