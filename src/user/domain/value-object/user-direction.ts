import { ValueObject } from "src/common/domain"
import { InvalidUserDirectionNameException } from "../domain-exceptions/invalid-user-direction-name-exception"
import { InvalidUserLatitudeDirectionException } from "../domain-exceptions/invalid-user-latitude-direction-exception"
import { InvalidUserLongitudeDirectionException } from "../domain-exceptions/invalid-user-longitude-direction-exception"

export class UserDirection implements ValueObject<UserDirection> {

    private readonly name: string
    private readonly favorite: boolean
    private readonly lat: number
    private readonly lng: number


    equals(valueObject: UserDirection): boolean {
        if (this.Name===valueObject.Name &&
            this.Favorite===valueObject.Favorite &&
            this.Lat===valueObject.Lat &&
            this.Lng===valueObject.Lng 
        ) return true
        return false
    }
    
    get Name(){ return this.name }
    get Favorite(){ return this.favorite }
    get Lat(){ return this.lat }
    get Lng(){ return this.lng }


    static create ( 
        name: string,
        favorite: boolean,
        lat: number,
        lng: number
    ): UserDirection {
        
        const regex = new RegExp(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]{1,50}$/)      
        if (!regex.test(name)) 
            throw new InvalidUserDirectionNameException(name)

        if (Math.abs(lat) > 90) { throw new InvalidUserLatitudeDirectionException(lat.toString()) }
        if (Math.abs(lng) > 180) { throw new InvalidUserLongitudeDirectionException(lng.toString()) }

        return new UserDirection( name,favorite,lat,lng)
    }

    private constructor(
        name: string,
        favorite: boolean,
        lat: number,
        lng: number
    ){
        this.name=name
        this.favorite=favorite
        this.lat=lat
        this.lng=lng
    }

}