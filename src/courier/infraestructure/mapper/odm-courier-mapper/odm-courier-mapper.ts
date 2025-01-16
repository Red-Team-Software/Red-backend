import { IMapper } from "src/common/application/mappers/mapper.interface";
import { IOdmCourier } from "../../model-entity/odm-model-entity/odm-courier-interface";
import { Courier } from "src/courier/domain/aggregate/courier";
import { CourierId } from "src/courier/domain/value-objects/courier-id";
import { CourierName } from "src/courier/domain/value-objects/courier-name";
import { CourierImage } from "src/courier/domain/value-objects/courier-image";
import { CourierDirection } from "src/courier/domain/value-objects/courier-direction";

export class OdmCourierMapper implements IMapper <Courier,IOdmCourier>{
    
    
    async fromPersistencetoDomain(infraEstructure: IOdmCourier): Promise<Courier> {
        
        return Courier.initializeAggregate(
            CourierId.create(infraEstructure.id),
            CourierName.create(infraEstructure.name),
            CourierImage.create(infraEstructure.image),
            CourierDirection.create(
                infraEstructure.latitude,
                infraEstructure.longitude
            )
        )
    }
    
    
    async fromDomaintoPersistence(c: Courier): Promise<IOdmCourier> {
            return {
                id: c.getId().courierId,
                name: c.CourierName.courierName,
                image: c.CourierImage.Value,
                latitude: c.CourierDirection.Latitude,
                longitude: c.CourierDirection.Longitude,
                email: '',
                password: ''
            }
    }
}