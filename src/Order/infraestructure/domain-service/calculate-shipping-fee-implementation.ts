import { Result } from "src/common/utils/result-handler/result";
import { ICalculateShippingFee } from "src/Order/domain/domain-services/calculate-shippping-fee.interfafe";
import { OrderDirection } from "src/Order/domain/value_objects/order-direction";
import { OrderShippingFee } from "src/Order/domain/value_objects/order-shipping-fee";


export class CalculateShippingFeeImplementation implements ICalculateShippingFee {
    async calculateShippingFee(direccion: OrderDirection): Promise<Result<OrderShippingFee>> {
        return Result.success(OrderShippingFee.create(100));
    }
}