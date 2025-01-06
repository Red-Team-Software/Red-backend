import { BadRequestException } from "src/common/infraestructure/infraestructure-exception";
import { Result } from "src/common/utils/result-handler/result";
import { ICalculateShippingFee } from "src/order/domain/domain-services/interfaces/calculate-shippping-fee.interface";
import { OrderDirection } from "src/order/domain/value_objects/order-direction";
import { OrderShippingFee } from "src/order/domain/value_objects/order-shipping-fee";
import { HereMapsSingelton } from "src/common/infraestructure/here-maps/here-maps-singleton";
import { IhereMapsResponse } from "../interfaces/here-maps-response.interface";


export class CalculateShippingFeeHereMaps implements ICalculateShippingFee {
    private hereMap: HereMapsSingelton;


    constructor(
        hereMap: HereMapsSingelton
    ){
        this.hereMap = hereMap;
    }
    
    
    async calculateShippingFee(direccion: OrderDirection): Promise<Result<OrderShippingFee>> {
        try{
            let origind = direccion.Latitude;
            let destinationd = direccion.Longitude;
            let UserCoords = `${origind},${destinationd}`;
    
            const ucabCoords = "10.4944,-66.8901";
    
            const url = `https://router.hereapi.com/v8/routes?origin=${UserCoords}&destination=${ucabCoords}&return=summary&transportMode=car&apiKey=${this.hereMap.getapiKey()}`;
    
            let response= await fetch(url);
            if (!response.ok)  
                Result.fail(new BadRequestException());
            let data:IhereMapsResponse = await response.json();
            let distance = data.routes[0].sections[0].summary.length;
            let distanceKm = distance / 1000;
            let monto = distanceKm * 0.05;
            let montoReduce = parseFloat(monto.toFixed(2));
            return Result.success(OrderShippingFee.create(montoReduce));
        }catch(e){
            Result.fail(new BadRequestException());
        }
    }
}