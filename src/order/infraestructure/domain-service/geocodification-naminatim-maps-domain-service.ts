import { BadRequestException, NotFoundException } from "src/common/infraestructure/infraestructure-exception";
import { Result } from "src/common/utils/result-handler/result";
import { IGeocodification } from "src/order/domain/domain-services/interfaces/geocodification-interface";
import { OrderDirection } from "src/order/domain/value_objects/order-direction";
import { OrderAddressStreet } from "src/order/domain/value_objects/order-direction-street";
import { NaminatimResponse } from "../interfaces/naminatim-response.interface";


export class GeocodificationOpenStreeMapsDomainService implements IGeocodification {
    constructor(){}
    
    
    async LatitudeLongitudetoDirecction(location: OrderDirection): Promise<Result<OrderAddressStreet>> {
        try{
            const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${location.Latitude}&lon=${location.Longitude}`;

            const response = await fetch(url);
            const data:NaminatimResponse = await response.json();
            
            return Result.success(OrderAddressStreet.create(data.display_name));
        }
        catch(e){
            return Result.fail(new NotFoundException('direction not found'))
        }
    }


    async DirecctiontoLatitudeLongitude(address: OrderAddressStreet): Promise<Result<OrderDirection>> {
        throw new Error()
    }

}

