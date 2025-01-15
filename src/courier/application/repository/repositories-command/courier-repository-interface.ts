import { Result } from "src/common/utils/result-handler/result";
import { Courier } from "../../../domain/aggregate/courier";
import { CourierId } from "src/courier/domain/value-objects/courier-id";


export interface ICourierRepository {
    saveCourier(courier: Courier, email: string, password: string): Promise<Result<Courier>>
}