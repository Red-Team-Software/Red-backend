import { Result } from "src/common/utils/result-handler/result";
import { Courier } from "../aggregate/courier";


export interface ICourierRepository {
    saveCourier(courier: Courier): Promise<Result<Courier>>
}