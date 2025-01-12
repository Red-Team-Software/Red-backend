import { NotFoundException } from "src/common/infraestructure/infraestructure-exception";
import { Result } from "src/common/utils/result-handler/result";
import { FindAllPaymentMethodRequestDto } from "src/payment-methods/application/dto/request/find-all-payment-method-request.dto";
import { IPaymentMethodModel } from "src/payment-methods/application/model/payment-method-model";
import { IPaymentMethodQueryRepository } from "src/payment-methods/application/query-repository/orm-query-repository.interface";
import { PaymentMethodAgregate } from "src/payment-methods/domain/agregate/payment-method-agregate";
import { PaymentMethodId } from "src/payment-methods/domain/value-objects/payment-method-id";
import { PaymentMethodImage } from "src/payment-methods/domain/value-objects/payment-method-image";
import { PaymentMethodName } from "src/payment-methods/domain/value-objects/payment-method-name";
import { PaymentMethodState } from "src/payment-methods/domain/value-objects/payment-method-state";


export class PaymentMethodQueryRepositoryMock implements IPaymentMethodQueryRepository{


    constructor(private readonly paymentMethod: PaymentMethodAgregate[]){}
    verifyMethodRegisteredByName(name: PaymentMethodName): Promise<Result<boolean>> {
        throw new Error("Method not implemented.");
    }
    findMethodByIdDetail(id: PaymentMethodId): Promise<Result<IPaymentMethodModel>> {
        throw new Error("Method not implemented.");
    }
    findMethodByNameDetail(name: PaymentMethodName): Promise<Result<IPaymentMethodModel>> {
        throw new Error("Method not implemented.");
    }
    findAllMethodsDetail(pagination: FindAllPaymentMethodRequestDto): Promise<Result<IPaymentMethodModel[]>> {
        throw new Error("Method not implemented.");
    }

    async findMethodById(id: PaymentMethodId): Promise<Result<PaymentMethodAgregate>> {
        let method = this.paymentMethod.find( m => m.getId().equals(id) );
        if (!method)
            return Result.fail(new NotFoundException('Payment method not found'));
        return Result.success( method );
    }
    
    async findMethodByName(name: PaymentMethodName): Promise<Result<PaymentMethodAgregate>> {
        let method = this.paymentMethod.find( m => m.name.equals(name) );
        if (!method)
            return Result.fail(new NotFoundException('Payment method not found'));
        return Result.success( method );
    }
    
    async findAllMethods(pagination: FindAllPaymentMethodRequestDto): Promise<Result<PaymentMethodAgregate[]>> {
        let method = this.paymentMethod.slice( pagination.page,pagination.perPage );
        return Result.success( method );
    }
}