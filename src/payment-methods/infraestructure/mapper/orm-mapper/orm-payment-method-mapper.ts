import { PaymentMethodAgregate } from 'src/payment-methods/domain/agregate/payment-method-agregate';
import { IMapper } from '../../../../common/application/mappers/mapper.interface';
import { PaymentMethodEntity } from '../../entity/orm-entity/orm-payment-method-entity';
import { PaymentMethodId } from '../../../domain/value-objects/payment-method-id';
import { PaymentMethodName } from 'src/payment-methods/domain/value-objects/payment-method-name';
import { PaymentMethodState } from '../../../domain/value-objects/payment-method-state';


export class OrmPaymentMethodMapper implements IMapper<PaymentMethodAgregate,PaymentMethodEntity>{
    
    async fromPersistencetoDomain(infraEstructure: PaymentMethodEntity): Promise<PaymentMethodAgregate> {
        
        let method = PaymentMethodAgregate.initializeAgregate(
            PaymentMethodId.create(infraEstructure.id),
            PaymentMethodName.create(infraEstructure.name),
            PaymentMethodState.create(infraEstructure.state)
        );
        
        return method;
    }
    
    async fromDomaintoPersistence(domainEntity: PaymentMethodAgregate): Promise<PaymentMethodEntity> {
        
        let method = PaymentMethodEntity.create(
            domainEntity.getId().paymentMethodId,
            domainEntity.name.paymentMethodName,
            domainEntity.state.paymentMethodState
        );
        
        return method;
    }

}