import { OrderTotalAmount } from 'src/order/domain/value_objects/order-totalAmount';
import { OrderTaxes } from 'src/order/domain/value_objects/order-taxes';
import { Result } from 'src/common/utils/result-handler/result';
import { ICalculateTaxesFee } from 'src/order/domain/domain-services/calculate-taxes-fee.interface';


export class CalculateTaxesFeeMock implements ICalculateTaxesFee {
    async calculateTaxesFee(amount: OrderTotalAmount): Promise<Result<OrderTaxes>> {
        let taxes = amount.OrderAmount * 0.16;
        let orderTaxes = OrderTaxes.create(taxes);
        return Result.success(orderTaxes);
    }
}