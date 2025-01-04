import { Result } from "src/common/utils/result-handler/result";
import { OrderTaxes } from "../../value_objects/order-taxes";
import { OrderTotalAmount } from "../../value_objects/order-totalAmount";


export interface ICalculateTaxesFee {
    calculateTaxesFee(amount: OrderTotalAmount): Promise<Result<OrderTaxes>>;
}
