import { Result } from "src/common/utils/result-handler/result";
import { IPaymentMethodRepository } from "src/payment-methods/domain/repository/payment-method-repository.interface";
import { DataSource, Repository } from "typeorm";
import { PaymentMethodEntity } from "../../entity/orm-entity/orm-payment-method-entity";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { PaymentMethodAgregate } from "src/payment-methods/domain/agregate/payment-method-agregate";
import { PersistenceException } from "src/common/infraestructure/infraestructure-exception";


export class OrmPaymentMethodRepository extends Repository<PaymentMethodEntity> implements IPaymentMethodRepository {
    
    private readonly paymentMethodMapper: IMapper<PaymentMethodAgregate,PaymentMethodEntity>;

    constructor( 
        dataSource: DataSource,
        paymentMethodMapper: IMapper<PaymentMethodAgregate,PaymentMethodEntity>
    ) {
        super( PaymentMethodEntity, dataSource.createEntityManager());
        this.paymentMethodMapper = paymentMethodMapper;
    }
    
    async savePaymentMethod(method: PaymentMethodAgregate): Promise<Result<PaymentMethodAgregate>> {
        try {
            let paymentMethodEntity = await this.paymentMethodMapper.fromDomaintoPersistence(method);
            await this.save(paymentMethodEntity);
            return Result.success(method);
        } catch (error) {
            return Result.fail( new PersistenceException( 'Create payment method unsucssessfully' ) );
        }
    }

}