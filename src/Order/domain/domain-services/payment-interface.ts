import { Result } from "src/common/utils/result-handler/result";
import { OrderPayment } from "../value_objects/order-payment";

export interface IPaymentService{
    createPayment(pay: OrderPayment): Promise<Result<boolean>>;
}