import { Result } from "src/common/utils/result-handler/result";
import { PaymentMethodAgregate } from "src/payment-methods/domain/agregate/payment-method-agregate";
import { PaymentMethodId } from "src/payment-methods/domain/value-objects/payment-method-id";
import { PaymentMethodName } from "src/payment-methods/domain/value-objects/payment-method-name";
import { FindAllPaymentMethodRequestDto } from "../dto/request/find-all-payment-method-request.dto";
import { IPaymentMethodModel } from "../model/payment-method-model";


export interface IPaymentMethodQueryRepository {
    findMethodById(id: PaymentMethodId): Promise<Result<PaymentMethodAgregate>>;
    findMethodByName(name: PaymentMethodName): Promise<Result<PaymentMethodAgregate>>;
    findAllMethods(pagination: FindAllPaymentMethodRequestDto): Promise<Result<PaymentMethodAgregate[]>>;
    verifyMethodRegisteredByName(name:PaymentMethodName):Promise<Result<boolean>>
    findMethodByIdDetail(id: PaymentMethodId): Promise<Result<IPaymentMethodModel>>;
    findMethodByNameDetail(name: PaymentMethodName): Promise<Result<IPaymentMethodModel>>;
    findAllMethodsDetail(pagination: FindAllPaymentMethodRequestDto): Promise<Result<IPaymentMethodModel[]>>;
}