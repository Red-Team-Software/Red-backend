import { ValueObject } from "src/common/domain"
import { InvalidUserLongitudeDirectionException } from "src/user/domain/domain-exceptions/invalid-user-longitude-direction-exception"

export class DirectionLng implements ValueObject<DirectionLng> {

    private readonly lng: number

    equals(valueObject: DirectionLng): boolean {
        if (this.Value===valueObject.Value) return true
        return false
    }
    
    get Value(){ return this.lng }

    static create ( lng: number ): DirectionLng {
        return new DirectionLng( lng )
    }

    private constructor(lng:number){
        if (Math.abs(lng) > 180) { throw new InvalidUserLongitudeDirectionException(lng.toString()) }
        this.lng=lng
    }

    changeLongitude(long:DirectionLng){
        return new DirectionLng(long.Value)
    }

}