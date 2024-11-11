import { Result } from "src/common/utils/result-handler/result";
import { OrderDirection } from "../value_objects/order-direction";
import { OrderShippingFee } from "../value_objects/order-shipping-fee";

export interface ICalculateShippingFee {
    calculateShippingFee(direccion: OrderDirection): Promise<Result<OrderShippingFee>>;
}