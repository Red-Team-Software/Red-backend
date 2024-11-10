import { ICalculateShippingFee } from "src/Order/domain/domain-services/calculate-shippping-fee.interfafe";
import { OrderShippingFee } from "src/Order/domain/value_objects/order-shipping-fee";


export class CalculateShippingFeeImplementation implements ICalculateShippingFee {
    async calculateShippingFee(): Promise<OrderShippingFee> {
        return new OrderShippingFee(100);
    }
}