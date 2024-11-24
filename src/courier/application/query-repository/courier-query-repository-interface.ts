import { Result } from "src/common/utils/result-handler/result"
import { Courier } from "src/courier/domain/aggregate/courier"
import { CourierId } from "src/courier/domain/value-objects/courier-id"
import { CourierName } from "src/courier/domain/value-objects/courier-name"


export interface CourierQueryRepositoryInterface {
    findCourierById(courierId: CourierId): Promise<Result<Courier>>
    findCourierByCourierName(courierName: CourierName): Promise<Result<Courier>>
    findAllCouriers(): Promise<Result<Courier[]>>
}