import { BadRequestException } from "src/common/infraestructure/infraestructure-exception";
import { Result } from "src/common/utils/result-handler/result";
import { IGeocodification } from "src/Order/domain/domain-services/geocodification-interface";
import { OrderDirection } from "src/Order/domain/value_objects/order-direction";
import { OrderAddressStreet } from "src/Order/domain/value_objects/order-direction-street";
import { HereMapsSingelton } from "src/payments/infraestructure/here-maps-singleton";


export class GeocodificationHereMapsDomainService implements IGeocodification {
    private hereMap: HereMapsSingelton;

    constructor(
        hereMap: HereMapsSingelton
    ){
        this.hereMap = hereMap;
    }
    
    
    async LatitudeLongitudetoDirecction(location: OrderDirection): Promise<Result<OrderAddressStreet>> {
        const url = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${location.Latitude},${location.Longitude}&apiKey=${this.hereMap.getapiKey()}`;

        const response = await fetch(url);
        const data = await response.json();
        if (data.items.length === 0) return Result.fail(new BadRequestException());
        
        const address = data.items[0].address;
        
        let OrderAddress = OrderAddressStreet.create(address.label);
        return Result.success(OrderAddress);
    }


    async DirecctiontoLatitudeLongitude(address: OrderAddressStreet): Promise<Result<OrderDirection>> {
        const url = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(address.Address)}&apiKey=${this.hereMap.getapiKey()}`;
        
        const response = await fetch(url);
        const data = await response.json();
        if (data.items.length === 0) return Result.fail(new BadRequestException());
        let location = data.items[0].position;
        
        let orderDirection = OrderDirection.create(location.lat, location.lng);

        return Result.success(orderDirection);
    }

}

