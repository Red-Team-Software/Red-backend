import { Result } from 'src/common/utils/result-handler/result';
import { PaymentMethodAgregate } from 'src/payment-methods/domain/agregate/payment-method-agregate';
import { PaymentMethodId } from 'src/payment-methods/domain/value-objects/payment-method-id';
import { PaymentMethodName } from 'src/payment-methods/domain/value-objects/payment-method-name';
import { Model, Mongoose } from 'mongoose';
import { OdmPaymentMethod, OdmPaymentMethodSchema } from '../../entity/odm-entity/odm-payment-method-entity';
import { NotFoundException } from 'src/common/infraestructure/infraestructure-exception';
import { IPaymentMethodQueryRepository } from 'src/payment-methods/application/query-repository/orm-query-repository.interface';
import { IPaymentMethodModel } from 'src/payment-methods/application/model/payment-method-model';
import { FindAllPaymentMethodRequestDto } from 'src/payment-methods/application/dto/request/find-all-payment-method-request.dto';
import { OdmPaymentMethodMapper } from '../../mapper/odm-mapper/odm-payment-method-mapper';

export class OdmPaymentMethodQueryRepository implements IPaymentMethodQueryRepository {
    
    private readonly model: Model<OdmPaymentMethod>
    private readonly odmMapper:OdmPaymentMethodMapper

    constructor( mongoose: Mongoose ) { 
            this.model = mongoose.model<OdmPaymentMethod>('OdmPaymentMethod', OdmPaymentMethodSchema)
            this.odmMapper=new OdmPaymentMethodMapper()
    }

    TransformToDataModel(odmPaymentMethod: OdmPaymentMethod): IPaymentMethodModel {
    
        return {
            paymentMethodId: odmPaymentMethod.id,
            paymentMethodName: odmPaymentMethod.name,
            paymentMethodState: odmPaymentMethod.state,
            paymentMethodImage: odmPaymentMethod.imageUrl
        }
    }
    
    async findMethodById(id: PaymentMethodId): Promise<Result<PaymentMethodAgregate>> {
        try{
            let PaymentMethod = await this.model.findOne({id: id.paymentMethodId});
            
            if(!PaymentMethod) 
                return Result.fail(new NotFoundException('Payment method not found'));

            let domainMethod = await this.odmMapper.fromPersistencetoDomain(PaymentMethod);

            return Result.success(domainMethod);
        }catch(error){
            return Result.fail(new NotFoundException('Payment method not found'));
        };
    }

    async findMethodByName(name: PaymentMethodName): Promise<Result<PaymentMethodAgregate>> {
        try{
            let PaymentMethod = await this.model.findOne({name: name.paymentMethodName});
            
            if(!PaymentMethod) 
                return Result.fail(new NotFoundException('Payment method not found'));

            let domainMethod = await this.odmMapper.fromPersistencetoDomain(PaymentMethod);

            return Result.success(domainMethod);
        }catch(error){
            return Result.fail(new NotFoundException('Payment method not found'));
        };
    }

    async findAllMethods(pagination: FindAllPaymentMethodRequestDto): Promise<Result<PaymentMethodAgregate[]>> {
        try{
            let PaymentMethod = await this.model.find()
            .skip(pagination.page)
            .limit(pagination.perPage);
            
            if(!PaymentMethod) 
                return Result.fail(new NotFoundException('Payment method not found'));

            let paymentMethods = PaymentMethod.map(async paymentMethod => await this.odmMapper.fromPersistencetoDomain(paymentMethod));

            let p = await Promise.all(paymentMethods);

            return Result.success(p);
        }catch(error){
            return Result.fail(new NotFoundException('Payment method not found'));
        };
    }

    async verifyMethodRegisteredByName(name: PaymentMethodName): Promise<Result<boolean>> {
        try {
            const paymentMethod = await this.model.findOne({ name: name.paymentMethodName });
            if (!paymentMethod) {
                return Result.success(false);
            }
            return Result.success(true);
        } catch (error) {
            return Result.fail(new NotFoundException('Error verifying payment method registration'));
        }
    }

    async findMethodByIdDetail(id: PaymentMethodId): Promise<Result<IPaymentMethodModel>> {
        try{
            let PaymentMethod = await this.model.findOne({id: id.paymentMethodId});
            
            if(!PaymentMethod) 
                return Result.fail(new NotFoundException('Payment method not found'));

            return Result.success(this.TransformToDataModel(PaymentMethod));
        }catch(error){
            return Result.fail(new NotFoundException('Payment method not found'));
        };
    }

    async findMethodByNameDetail(name: PaymentMethodName): Promise<Result<IPaymentMethodModel>> {
        try{
            let PaymentMethod = await this.model.findOne({name: name.paymentMethodName});
            
            if(!PaymentMethod) 
                return Result.fail(new NotFoundException('Payment method not found'));

            return Result.success(this.TransformToDataModel(PaymentMethod));
        }catch(error){
            return Result.fail(new NotFoundException('Payment method not found'));
        };
    }

    async findAllMethodsDetail(pagination: FindAllPaymentMethodRequestDto): Promise<Result<IPaymentMethodModel[]>> {
        try{
            let PaymentMethod = await this.model.find()
            .skip(pagination.page)
            .limit(pagination.perPage);
            
            if(!PaymentMethod) 
                return Result.fail(new NotFoundException('Payment method not found'));

            let paymentMethods = PaymentMethod.map(paymentMethod => this.TransformToDataModel(paymentMethod));

            return Result.success(paymentMethods);
        }catch(error){
            return Result.fail(new NotFoundException('Payment method not found'));
        };
    }

}