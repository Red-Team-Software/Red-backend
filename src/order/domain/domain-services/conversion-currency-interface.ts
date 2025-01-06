import { Result } from "src/common/utils/result-handler/result";
import { ConvertAmount } from "../value_objects/vo-domain-services/convert-amount";


export interface IConversionService {
    convertAmountUSDtoVES(amount: ConvertAmount): Promise<Result<ConvertAmount>>;
    convertAmountVEStoUSD(amount: ConvertAmount): Promise<Result<ConvertAmount>>;
}