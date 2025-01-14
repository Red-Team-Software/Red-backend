import { IMapper } from "src/common/application/mappers/mapper.interface";
import { OrmCourierEntity } from "../../entities/orm-courier-entity";
import { Courier } from "src/courier/domain/aggregate/courier";
import { CourierName } from "src/courier/domain/value-objects/courier-name";
import { CourierImage } from "src/courier/domain/value-objects/courier-image";
import { CourierId } from "src/courier/domain/value-objects/courier-id";
import { IIdGen } from "src/common/application/id-gen/id-gen.interface";
import { CourierDirection } from "src/courier/domain/value-objects/courier-direction";


export class OrmCourierMapper implements IMapper<Courier,OrmCourierEntity>{
    
    constructor (
        private readonly idGen:IIdGen<string>
    ){}
    
    async fromDomaintoPersistence(domainEntity: Courier): Promise<OrmCourierEntity> {
        
        let ormCourier: OrmCourierEntity = OrmCourierEntity.create(
            domainEntity.getId().courierId,
            domainEntity.CourierName.courierName,
            domainEntity.CourierImage.Value,
            domainEntity.CourierDirection.Latitude,
            domainEntity.CourierDirection.Longitude,
            '',
            ''
        );
        
        return ormCourier;
    }
    
    async fromPersistencetoDomain(infraEstructure: OrmCourierEntity): Promise<Courier> {

        let newCourier: Courier = Courier.initializeAggregate(
            CourierId.create(infraEstructure.id),
            CourierName.create(infraEstructure.name),
            CourierImage.create(infraEstructure.image),
            CourierDirection.create(
                infraEstructure.latitude,
                infraEstructure.longitude
            )
        );
        
        return newCourier;
    }


}