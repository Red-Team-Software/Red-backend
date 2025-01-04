import { Result } from "src/common/utils/result-handler/result";
import { ICalculateShippingFee } from "src/order/domain/domain-services/interfaces/calculate-shippping-fee.interface";
import { OrderDirection } from "src/order/domain/value_objects/order-direction";
import { OrderShippingFee } from "src/order/domain/value_objects/order-shipping-fee";


export class CalculateShippingFeeImplementation implements ICalculateShippingFee {
    async calculateShippingFee(direccion: OrderDirection): Promise<Result<OrderShippingFee>> {
        return Result.success(OrderShippingFee.create(100));
    }
}