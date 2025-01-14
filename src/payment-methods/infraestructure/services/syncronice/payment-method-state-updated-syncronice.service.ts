import { Result } from 'src/common/utils/result-handler/result';
import { ISycnchronizeService } from 'src/common/infraestructure/synchronize-service/synchronize.service.interface';
import { Model, Mongoose } from 'mongoose';
import { OdmPaymentMethod, OdmPaymentMethodSchema } from '../../entity/odm-entity/odm-payment-method-entity';
import { PaymentMethodStateUpdatedInfraestructureRequestDTO } from '../dto/payment-method-state-updated-infraestructure-request-dto';

export class PaymentStateUpdatedSyncroniceService implements ISycnchronizeService<PaymentMethodStateUpdatedInfraestructureRequestDTO,void>{

    private readonly model: Model<OdmPaymentMethod>

    constructor( mongoose: Mongoose ) { 
        this.model = mongoose.model<OdmPaymentMethod>('OdmPaymentMethod', OdmPaymentMethodSchema)
    }
    
    async execute(event: PaymentMethodStateUpdatedInfraestructureRequestDTO): Promise<Result<void>> {
        let paymentMethod = await this.model.findOne({id:event.id})

        if (event.state)
            paymentMethod.state=event.state

        await this.model.updateOne({id:event.id},paymentMethod)
        return Result.success(undefined)
    }   
}