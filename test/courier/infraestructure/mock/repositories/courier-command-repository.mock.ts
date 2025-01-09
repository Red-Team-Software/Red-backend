import { Result } from "src/common/utils/result-handler/result";
import { Courier } from "src/courier/domain/aggregate/courier";
import { ICourierRepository } from "src/courier/domain/repositories/courier-repository-interface";


export class CourierRepositoryMock implements ICourierRepository{

    private couriers: Courier[] = [];

    constructor(couriers?:Courier[]){
        this.couriers=couriers
    }
    
    async saveCourier(courier: Courier): Promise<Result<Courier>> {
        this.couriers.push(courier);
        return Result.success(courier);
    }
}
