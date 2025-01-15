import { Result } from 'src/common/utils/result-handler/result';
import { ISycnchronizeService } from 'src/common/infraestructure/synchronize-service/synchronize.service.interface';
import { Model, Mongoose } from 'mongoose';
import { OdmOrder, OdmOrderSchema } from '../../entities/odm-entities/odm-order-entity';
import { OrderRegisteredInfraestructureRequestDTO } from '../dto/order-registered-infraestructure-request-dto';

export class OrderRegisteredSyncroniceService implements ISycnchronizeService<OrderRegisteredInfraestructureRequestDTO,void>{

    private readonly model: Model<OdmOrder>

    constructor( mongoose: Mongoose ) { 
        this.model = mongoose.model<OdmOrder>('OdmOrder', OdmOrderSchema)
    }
    
    async execute(event: OrderRegisteredInfraestructureRequestDTO): Promise<Result<void>> {
        
        const order = new this.model({
            id: event.orderId,
            state: event.orderState,
            createdDate: event.orderCreateDate,
            totalAmount: event.totalAmount.amount,
            currency: event.totalAmount.currency,
            latitude: event.orderDirection.lat,
            longitude: event.orderDirection.long,
            receivedDate: event.orderReceivedDate 
            ? event.orderReceivedDate
            : null,
            courier_id: event.orderCourier,
            coupon_id: event.orderCupon,
            user_id: event.orderUserId,
            order_payment: {
                id: event.orderPayment.paymentId,
                amount: event.orderPayment.paymentAmount,
                currency: event.orderPayment.paymentCurrency,
                paymentMethod: event.orderPayment.paymentMethod
            },
            product_details: event.products,
            bundle_details: event.bundles,
            report: event.orderReport 
            ? event.orderReport
            : null
        })


        await this.model.create(order)
        return Result.success(undefined)
    }   
}