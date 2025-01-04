import { Result } from "src/common/utils/result-handler/result";
import { Order } from "../../aggregate/order";

export interface IPaymentMethodService{
    createPayment(order: Order): Promise<Result<Order>>;
}