import { OrderTotalAmount } from 'src/Order/domain/value_objects/order-totalAmount';
import { ICalculateTaxesFee } from '../../domain/domain-services/calculate-taxes-fee.interface';
import { OrderTaxes } from 'src/Order/domain/value_objects/order-taxes';
import { Result } from 'src/common/utils/result-handler/result';


export class CalculateTaxesFeeImplementation implements ICalculateTaxesFee {
    async calculateTaxesFee(amount: OrderTotalAmount): Promise<Result<OrderTaxes>> {
        let taxes = amount.OrderAmount * 0.16;
        let orderTaxes = OrderTaxes.create(taxes);
        return Result.success(orderTaxes);
    }
}