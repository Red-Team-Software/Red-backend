import { Result } from "src/common/utils/result-handler/result";
import { PaymentMethodAgregate } from "../agregate/payment-method-agregate";


export interface IPaymentMethodRepository {
    savePaymentMethod(method: PaymentMethodAgregate): Promise<Result<PaymentMethodAgregate>>;
}