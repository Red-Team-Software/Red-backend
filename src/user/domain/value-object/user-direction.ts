import { ValueObject } from "src/common/domain"
import { InvalidUserDirectionNameException } from "../domain-exceptions/invalid-user-direction-name-exception"
import { InvalidUserDirectionException } from "../domain-exceptions/invalid-user-direction-exception"

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
        
        const regexName=new RegExp(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]{1,50}$/)
        if (!regexName.test(name)) 
            throw new InvalidUserDirectionNameException()

        if (Math.abs(lat) > 90) { throw new InvalidUserDirectionException(); }
        if (Math.abs(lng) > 180) { throw new InvalidUserDirectionException(); }

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