import { Result } from "src/common/utils/result-handler/result";
import { Courier } from "../../../domain/aggregate/courier";


export interface ICourierRepository {
    saveCourier(courier: Courier, email: string, password: string): Promise<Result<Courier>>
}