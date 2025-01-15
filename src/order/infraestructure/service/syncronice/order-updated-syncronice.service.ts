import { Result } from 'src/common/utils/result-handler/result';
import { ISycnchronizeService } from 'src/common/infraestructure/synchronize-service/synchronize.service.interface';
import { Mongoose, Model } from 'mongoose';
import { OrderUpdatedInfraestructureRequestDTO } from '../dto/order-updated-infraestructure-request-dto';
import { OdmOrder, OdmOrderSchema } from '../../entities/odm-entities/odm-order-entity';

export class OrderUpdatedSyncroniceService 
implements ISycnchronizeService<OrderUpdatedInfraestructureRequestDTO,void>{
    
    private readonly model: Model<OdmOrder>

    constructor( mongoose: Mongoose ) { 
        this.model = mongoose.model<OdmOrder>('OdmOrder', OdmOrderSchema)
    }
    async execute(event: OrderUpdatedInfraestructureRequestDTO): Promise<Result<void>> {
        let order= await this.model.findOne({id: event.orderId})
        
        if (event.orderState)
            order.state=event.orderState;

        if (event.orderReport)
            order.report=event.orderReport;

        if (event.orderReceivedDate)
            order.receivedDate=event.orderReceivedDate;

        if (event.orderCourierId)
            order.courier_id = event.orderCourierId;
        
        await this.model.updateOne({id:order.id}, order)

        return Result.success(undefined)
    }   
}