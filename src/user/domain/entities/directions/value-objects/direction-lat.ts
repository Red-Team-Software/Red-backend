import { ValueObject } from "src/common/domain"
import { InvalidUserLatitudeDirectionException } from "src/user/domain/domain-exceptions/invalid-user-latitude-direction-exception"

export class DirectionLat implements ValueObject<DirectionLat> {

    private readonly lat: number

    equals(valueObject: DirectionLat): boolean {
        if (this.Value===valueObject.Value) return true
        return false
    }
    
    get Value(){ return this.lat }

    static create ( lat: number ): DirectionLat {
        return new DirectionLat( lat )
    }

    private constructor(lat:number){
        if (Math.abs(lat) > 90) { throw new InvalidUserLatitudeDirectionException(lat.toString()) }
        this.lat=lat
    }

    changeLatitud(Lat:DirectionLat){
        return new DirectionLat(Lat.Value)
    }

}