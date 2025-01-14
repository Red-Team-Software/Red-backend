import { Result } from "src/common/utils/result-handler/result";
import { ICourierModel } from "src/courier/application/model/courier-model-interface";
import { ICourierQueryRepository } from "src/courier/application/repository/query-repository/courier-query-repository-interface";
import { Courier } from "src/courier/domain/aggregate/courier";
import { CourierId } from "src/courier/domain/value-objects/courier-id";
import { CourierImage } from "src/courier/domain/value-objects/courier-image";
import { CourierName } from "src/courier/domain/value-objects/courier-name";


export class CourierQueryRepositoryMock implements ICourierQueryRepository{
    
    constructor (private readonly couriers: Courier[] ) {}
    
    transformToDatamodel(domain: Courier): ICourierModel {
            return{
                courierId: domain.getId().courierId,
                courierName: domain.CourierName.courierName,
                courierImage: domain.CourierImage.Value,
                courierDirection:{
                    lat: domain.CourierDirection.Latitude,
                    long: domain.CourierDirection.Longitude,
                },
                email: "gadeso2003@gmail.com",
                password: "password",
            };
        }
    
    async findCourierByIdDetail(courierId: CourierId): Promise<Result<ICourierModel>> {
        let courier = this.couriers.find(m => m.getId().equals(courierId));
        const courierModel = this.transformToDatamodel(courier);
        return Result.success(courierModel);
    }
    
    findCourierByEmailDetail(email: string): Promise<Result<ICourierModel>> {
        throw new Error("Method not implemented.");
    }
    
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