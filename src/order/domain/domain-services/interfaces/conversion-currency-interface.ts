import { Result } from "src/common/utils/result-handler/result";
import { ConvertAmount } from "../../value_objects/vo-domain-services/convert-amount";
import { OrderCurrencyEnum } from "../../value_objects/enum/order-enum-currency-total-amoun";


export interface IConversionService {
    convertAmount(amount: ConvertAmount, currency:OrderCurrencyEnum): Promise<Result<ConvertAmount>>;
}