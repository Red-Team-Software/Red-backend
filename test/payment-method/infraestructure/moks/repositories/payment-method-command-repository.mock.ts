import { Result } from "src/common/utils/result-handler/result";
import { PaymentMethodAgregate } from "src/payment-methods/domain/agregate/payment-method-agregate";
import { IPaymentMethodRepository } from "src/payment-methods/domain/repository/payment-method-repository.interface";



export class PaymentMethodCommandRepositoryMock implements IPaymentMethodRepository{
    
    paymentMethods: PaymentMethodAgregate[] = [];
    
    
    async savePaymentMethod(method: PaymentMethodAgregate): Promise<Result<PaymentMethodAgregate>> {
        
        this.paymentMethods.push(method);
        
        return Result.success(method);
    }
    
}