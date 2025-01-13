import { IMapper } from "src/common/application/mappers/mapper.interface";
import { IOdmPaymentMethod } from "../../model-entity/odm-model-entity/odm-payment-method-interface";
import { PaymentMethodAgregate } from "src/payment-methods/domain/agregate/payment-method-agregate";
import { PaymentMethodId } from "src/payment-methods/domain/value-objects/payment-method-id";
import { PaymentMethodName } from "src/payment-methods/domain/value-objects/payment-method-name";
import { PaymentMethodState } from "src/payment-methods/domain/value-objects/payment-method-state";
import { PaymentMethodImage } from "src/payment-methods/domain/value-objects/payment-method-image";

export class OdmPaymentMethodMapper implements IMapper<PaymentMethodAgregate,IOdmPaymentMethod>{
    
    async fromPersistencetoDomain(infraEstructure: IOdmPaymentMethod): Promise<PaymentMethodAgregate> {
        
        let method = PaymentMethodAgregate.initializeAgregate(
            PaymentMethodId.create(infraEstructure.id),
            PaymentMethodName.create(infraEstructure.name),
            PaymentMethodState.create(infraEstructure.state),
            PaymentMethodImage.create(infraEstructure.imageUrl)
        );
        
        return method;
    }
    
    async fromDomaintoPersistence(domainEntity: PaymentMethodAgregate): Promise<IOdmPaymentMethod> {
        
        let method: IOdmPaymentMethod = {
            id: domainEntity.getId().paymentMethodId,
            name: domainEntity.name.paymentMethodName,
            state: domainEntity.state.paymentMethodState,
            imageUrl: domainEntity.image.Value
        };
        
        return method;
    }

}