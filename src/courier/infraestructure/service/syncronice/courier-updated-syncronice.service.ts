import { Result } from 'src/common/utils/result-handler/result';
import { ISycnchronizeService } from 'src/common/infraestructure/synchronize-service/synchronize.service.interface';
import { Mongoose, Model } from 'mongoose';
import { CourierUpdatedInfraestructureRequestDTO } from '../dto/request/courier-updated-infraestructure-request-dto';
import { OdmCourier, OdmCourierSchema } from '../../entities/odm-entities/odm-courier-entity';

export class CourierUpdatedSyncroniceService 
implements ISycnchronizeService<CourierUpdatedInfraestructureRequestDTO,void>{
    
    private readonly model: Model<OdmCourier>


    constructor( mongoose: Mongoose ) { 
        this.model = mongoose.model<OdmCourier>('OdmCourier', OdmCourierSchema)
    }
    async execute(event: CourierUpdatedInfraestructureRequestDTO): Promise<Result<void>> {
        let courier = await this.model.findOne({id: event.courierId})
        
        courier.latitude = event.courierDirection.lat
        courier.longitude = event.courierDirection.long
        
        await this.model.updateOne({id:courier.id},courier)

        return Result.success(undefined)
    }   
}