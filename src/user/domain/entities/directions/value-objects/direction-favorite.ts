import { ValueObject } from "src/common/domain"

export class DirectionFavorite implements ValueObject<DirectionFavorite> {

    private readonly favorite: boolean

    equals(valueObject: DirectionFavorite): boolean {
        if (this.Value===valueObject.Value) return true
        return false
    }
    
    get Value(){ return this.favorite }

    static create ( favorite: boolean ): DirectionFavorite {
        return new DirectionFavorite( favorite )
    }

    private constructor(favorite:boolean){
        this.favorite=favorite
    }

    changeFavorite(directionFav:DirectionFavorite){
        return new DirectionFavorite(directionFav.Value)
    }

}