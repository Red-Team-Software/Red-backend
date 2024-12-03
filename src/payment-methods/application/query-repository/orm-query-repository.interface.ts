import { Result } from "src/common/utils/result-handler/result";
import { PaymentMethodAgregate } from "src/payment-methods/domain/agregate/payment-method-agregate";
import { PaymentMethodId } from "src/payment-methods/domain/value-objects/payment-method-id";
import { PaymentMethodName } from "src/payment-methods/domain/value-objects/payment-method-name";


export interface IPaymentMethodQueryRepository {
    findMethodById(id: PaymentMethodId): Promise<Result<PaymentMethodAgregate>>;
    findMethodByName(name: PaymentMethodName): Promise<Result<PaymentMethodAgregate>>;
    findAllMethods(): Promise<Result<PaymentMethodAgregate[]>>;
}