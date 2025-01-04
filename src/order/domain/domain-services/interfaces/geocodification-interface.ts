import { Result } from "src/common/utils/result-handler/result";
import { OrderDirection } from "../../value_objects/order-direction";
import { OrderAddressStreet } from "../../value_objects/order-direction-street";

export interface IGeocodification {
    LatitudeLongitudetoDirecction(location: OrderDirection): Promise<Result<OrderAddressStreet>>;
    DirecctiontoLatitudeLongitude(direction: OrderAddressStreet): Promise<Result<OrderDirection>>;
}