import { Result } from 'src/common/utils/result-handler/result';
import { ISycnchronizeService } from 'src/common/infraestructure/synchronize-service/synchronize.service.interface';
import { Model, Mongoose } from 'mongoose';
import { OdmPaymentMethod, OdmPaymentMethodSchema } from '../../entity/odm-entity/odm-payment-method-entity';
import { PaymentMethodRegistredInfraestructureRequestDTO } from '../dto/payment-method-registered-infraestructure-request-dto';

export class PaymentMethodRegisteredSyncroniceService implements ISycnchronizeService<PaymentMethodRegistredInfraestructureRequestDTO,void>{

    private readonly model: Model<OdmPaymentMethod>

    constructor( mongoose: Mongoose ) { 
        this.model = mongoose.model<OdmPaymentMethod>('OdmPaymentMethod', OdmPaymentMethodSchema)
    }
    
    async execute(event: PaymentMethodRegistredInfraestructureRequestDTO): Promise<Result<void>> {
        const product = new this.model({
            id: event.id,
            name: event.name,
            state: event.state,
            imageUrl: event.imageUrl
        })
        await this.model.create(product)
        return Result.success(undefined)
    }   
}