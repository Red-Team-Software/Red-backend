import { Result } from "src/common/utils/result-handler/result";
import { FindAllPaymentMethodRequestDto } from "src/payment-methods/application/dto/request/find-all-payment-method-request.dto";
import { IPaymentMethodQueryRepository } from "src/payment-methods/application/query-repository/orm-query-repository.interface";
import { PaymentMethodAgregate } from "src/payment-methods/domain/agregate/payment-method-agregate";
import { PaymentMethodId } from "src/payment-methods/domain/value-objects/payment-method-id";
import { PaymentMethodImage } from "src/payment-methods/domain/value-objects/payment-method-image";
import { PaymentMethodName } from "src/payment-methods/domain/value-objects/payment-method-name";
import { PaymentMethodState } from "src/payment-methods/domain/value-objects/payment-method-state";


export class PaymentMethodQueryRepositoryMock implements IPaymentMethodQueryRepository{
    
    paymentMethod: PaymentMethodAgregate[] = [];

    constructor(){
        
        let m1 = PaymentMethodAgregate.initializeAgregate(
            PaymentMethodId.create("5c84a611-a1dd-4944-a60d-baad170c4593"),
            PaymentMethodName.create('Paypal'),
            PaymentMethodState.create('active'),
            PaymentMethodImage.create('image-2')
        );

        let m2 = PaymentMethodAgregate.initializeAgregate(
            PaymentMethodId.create("4ba7289d-9c8c-411a-8c88-8f596e5821fa"),
            PaymentMethodName.create('Stripe'),
            PaymentMethodState.create('active'),
            PaymentMethodImage.create('image-2')
        );
        
        this.paymentMethod.push(m1);
        this.paymentMethod.push(m2);
    }


    async findMethodById(id: PaymentMethodId): Promise<Result<PaymentMethodAgregate>> {
        let method = this.paymentMethod.find( m => m.getId().equals(id) );

        return Result.success( method );
    }
    
    
    async findMethodByName(name: PaymentMethodName): Promise<Result<PaymentMethodAgregate>> {
        let method = this.paymentMethod.find( m => m.name.equals(name) );

        return Result.success( method );
    }
    
    
    async findAllMethods(pagination: FindAllPaymentMethodRequestDto): Promise<Result<PaymentMethodAgregate[]>> {
        let method = this.paymentMethod.slice( pagination.page,pagination.perPage );

        return Result.success( method );
    }

}