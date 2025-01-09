import { Result } from "src/common/utils/result-handler/result";
import { IGeocodification } from "src/order/domain/domain-services/interfaces/geocodification-interface";
import { OrderDirection } from "src/order/domain/value_objects/order-direction";
import { OrderAddressStreet } from "src/order/domain/value_objects/order-direction-street";

export class GeocodificationDomainServiceMock implements IGeocodification {

    async LatitudeLongitudetoDirecction(location: OrderDirection): Promise<Result<OrderAddressStreet>> {
        let OrderAddress = OrderAddressStreet.create('Avenida Principal Alto Prado, Edificio Alto Prado Plaza')

        return Result.success(OrderAddress);
    }


    async DirecctiontoLatitudeLongitude(address: OrderAddressStreet): Promise<Result<OrderDirection>> {

        let orderDirection = OrderDirection.create(40.51661, -10.4812);

        return Result.success(orderDirection);
    }

}

