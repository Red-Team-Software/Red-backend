import { Result } from 'src/common/utils/result-handler/result';
import { ISycnchronizeService } from 'src/common/infraestructure/synchronize-service/synchronize.service.interface';
import { Model, Mongoose, connect } from 'mongoose';
import { OdmCourier, OdmCourierSchema } from '../../entities/odm-entities/odm-courier-entity';
import { CourierRegistredInfraestructureRequestDTO } from '../dto/request/courier-registered-infraestructure-request-dto';
import { ICourierQueryRepository } from 'src/courier/application/repository/query-repository/courier-query-repository-interface';
import { CourierId } from '../../../domain/value-objects/courier-id';

export class CourierRegisteredSyncroniceService implements ISycnchronizeService<CourierRegistredInfraestructureRequestDTO,void>{

    private readonly model: Model<OdmCourier>

    constructor( 
        mongoose: Mongoose,
        private readonly courierQueryRepository: ICourierQueryRepository,
    ) { 
        this.model = mongoose.model<OdmCourier>('OdmCourier', OdmCourierSchema)
    }
    
    async execute(event: CourierRegistredInfraestructureRequestDTO): Promise<Result<void>> {
        
        let response = await this.courierQueryRepository.findCourierByIdDetail(
            CourierId.create(event.courierId))
        
        const courier = new this.model({
            id: event.courierId,
            name: event.courierName,
            image: event.courierImage,
            email: response.getValue.email,
            password: response.getValue.password,
            latitude: event.courierDirection.lat,
            longitude: event.courierDirection.long
        })
        await this.model.create(courier)
        return Result.success(undefined)
    }   
}