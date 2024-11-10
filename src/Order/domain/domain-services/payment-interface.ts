import { OrderPayment } from "../value_objects/order-payment";

export interface IPaymentService{
    createPayment(pay: OrderPayment): Promise<boolean>;
}