import { Result } from "src/common/utils/result-handler/result";
import { Order } from "../../aggregate/order";
import { IPaymentMethodService } from "../interfaces/payment-method-interface";

export class PayOrderService {
    constructor(private readonly payment:IPaymentMethodService){}
    async PayOrder(order:Order): Promise<Result<Order>>{
        return this.payment.createPayment(order)
    }
}