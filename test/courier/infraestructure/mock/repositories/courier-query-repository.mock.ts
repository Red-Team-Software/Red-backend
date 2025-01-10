import { Result } from "src/common/utils/result-handler/result";
import { ICourierQueryRepository } from "src/courier/application/query-repository/courier-query-repository-interface";
import { Courier } from "src/courier/domain/aggregate/courier";
import { CourierId } from "src/courier/domain/value-objects/courier-id";
import { CourierImage } from "src/courier/domain/value-objects/courier-image";
import { CourierName } from "src/courier/domain/value-objects/courier-name";


export class CourierQueryRepositoryMock implements ICourierQueryRepository{
    
    constructor (private readonly couriers: Courier[] ) {}
    
    async findCourierById(courierId: CourierId): Promise<Result<Courier>> {
        let courier = this.couriers.find( m => m.getId().equals(courierId) );
        return Result.success(courier);
    }
    async findCourierByName(courierName: CourierName): Promise<Result<Courier>> {
        let courier = this.couriers.find( m => m.CourierName.equals(courierName) );
        return Result.success(courier);
    }
    async findAllCouriers(): Promise<Result<Courier[]>> {
        return Result.success(this.couriers);
    }
    

}