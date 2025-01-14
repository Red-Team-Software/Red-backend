import { Entity } from "src/common/domain";
import { DirectionId } from "./value-objects/direction-id";
import { DirectionLng } from "./value-objects/direction-lng";
import { DirectionName } from "./value-objects/direction-name";
import { DirectionLat } from "./value-objects/direction-lat";
import { DirectionFavorite } from "./value-objects/direction-favorite";


export class UserDirection extends Entity<DirectionId> {
    
    constructor(
        DirectionId: DirectionId,
        private readonly directionFavorite:DirectionFavorite,
        private readonly directionLat:DirectionLat,
        private readonly directionLng:DirectionLng,
        private readonly directionName:DirectionName
    ) {
        super(DirectionId);
    }

    static create(
        directionId: DirectionId,
        directionFavorite:DirectionFavorite,
        directionLat:DirectionLat,
        directionLng:DirectionLng,
        directionName:DirectionName    
    ): UserDirection {
        return new UserDirection(
            directionId,
            directionFavorite,
            directionLat,
            directionLng,
            directionName 
        )
    }

    changeFavorite(favorite:DirectionFavorite):UserDirection{
        this.DirectionFavorite.changeFavorite(favorite)
        return this
    }

    changeLat(lat:DirectionLat):UserDirection{
        this.DirectionLat.changeLatitud(lat)
        return this
    }

    changeLong(lon:DirectionLng):UserDirection{
        this.directionLng.changeLongitude(lon)
        return this
    }

    changeName(name:DirectionName){
        this.directionName.changeName(name)
        return this
    }

    get DirectionFavorite():DirectionFavorite{return this.directionFavorite}
    get DirectionLat():DirectionLat{ return this.directionLat}
    get DirectionLng():DirectionLng{ return this.directionLng}
    get DirectionName():DirectionName{ return this.directionName}
}