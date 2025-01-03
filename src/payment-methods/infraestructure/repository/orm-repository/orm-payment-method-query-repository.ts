import { DataSource, Repository } from "typeorm";
import { PaymentMethodEntity } from "../../entity/orm-entity/orm-payment-method-entity";
import { PaymentMethodAgregate } from "src/payment-methods/domain/agregate/payment-method-agregate";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { IPaymentMethodQueryRepository } from "src/payment-methods/application/query-repository/orm-query-repository.interface";
import { Result } from "src/common/utils/result-handler/result";
import { PaymentMethodId } from "src/payment-methods/domain/value-objects/payment-method-id";
import { PaymentMethodName } from "src/payment-methods/domain/value-objects/payment-method-name";
import { NotFoundException } from "src/common/infraestructure/infraestructure-exception";
import { FindAllPaymentMethodRequestDto } from "src/payment-methods/application/dto/request/find-all-payment-method-request.dto";


export class OrmPaymentMethodQueryRepository extends Repository<PaymentMethodEntity> implements IPaymentMethodQueryRepository {
    
    private readonly paymentMethodMapper: IMapper<PaymentMethodAgregate,PaymentMethodEntity>;

    constructor( 
        dataSource: DataSource,
        paymentMethodMapper: IMapper<PaymentMethodAgregate,PaymentMethodEntity>
    ) {
        super( PaymentMethodEntity, dataSource.createEntityManager());
        this.paymentMethodMapper = paymentMethodMapper;
    }
    
    async findMethodById(id: PaymentMethodId): Promise<Result<PaymentMethodAgregate>> {
        try{

            let methodEntity = await this.findOne({
                where: { id: id.paymentMethodId }
            });
            
            if(!methodEntity) return Result.fail(new NotFoundException('Payment method not found'));
        
            let methodDomain = await this.paymentMethodMapper.fromPersistencetoDomain(methodEntity);

            return Result.success(methodDomain);
        
        }catch(error){
            return Result.fail(new NotFoundException('Payment method not found'));
        };
    }
    async findMethodByName(name: PaymentMethodName): Promise<Result<PaymentMethodAgregate>> {
        try{

            let methodEntity = await this.findOne({
                where: { name: name.paymentMethodName }
            });
            
            if(!methodEntity) return Result.fail(new NotFoundException('Payment method not found'));
        
            let methodDomain = await this.paymentMethodMapper.fromPersistencetoDomain(methodEntity);

            return Result.success(methodDomain);
        
        }catch(error){
            return Result.fail(new NotFoundException('Payment method not found'));
        };
    }

    
    async findAllMethods(pagination: FindAllPaymentMethodRequestDto): Promise<Result<PaymentMethodAgregate[]>> {
        try{

            let methodEntity = await this.find();
            
            if(!methodEntity) return Result.fail(new NotFoundException('Payment methods not found'));
        
            let methodDomain: PaymentMethodAgregate[] = [];

            for(let method of methodEntity){
                let response = await this.paymentMethodMapper.fromPersistencetoDomain(method);
                methodDomain.push(response);
            };
            
            return Result.success(methodDomain);
        
        }catch(error){
            return Result.fail(new NotFoundException('Payment merthods not found'));
        };
    }
    

}