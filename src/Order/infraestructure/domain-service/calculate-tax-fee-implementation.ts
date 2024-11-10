import { OrderTotalAmount } from 'src/Order/domain/value_objects/order-totalAmount';
import { ICalculateTaxesFee } from '../../domain/domain-services/calculate-taxes-fee.interface';
import { OrderTaxes } from 'src/Order/domain/value_objects/order-taxes';


export class CalculateTaxesFeeImplementation implements ICalculateTaxesFee {
    calculateTaxesFee(amount: OrderTotalAmount): OrderTaxes {
        const taxes = amount.OrderTotalAmount * 0.16;
        return new OrderTaxes(taxes);
    }
}