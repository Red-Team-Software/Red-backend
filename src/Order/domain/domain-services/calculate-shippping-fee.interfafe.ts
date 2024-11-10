import { OrderShippingFee } from "../value_objects/order-shipping-fee";

export interface ICalculateShippingFee {
    calculateShippingFee(): Promise<OrderShippingFee>;
}