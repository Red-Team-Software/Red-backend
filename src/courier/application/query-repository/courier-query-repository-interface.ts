import { Result } from "src/common/utils/result-handler/result"
import { Courier } from "src/courier/domain/aggregate/courier"
import { CourierId } from "src/courier/domain/value-objects/courier-id"
import { CourierName } from "src/courier/domain/value-objects/courier-name"


export interface ICourierQueryRepository {
    findCourierById(courierId: CourierId): Promise<Result<Courier>>
    findCourierByName(courierName: CourierName): Promise<Result<Courier>>
    findAllCouriers(): Promise<Result<Courier[]>>
}