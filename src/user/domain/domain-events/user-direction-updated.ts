import { DomainEvent } from "src/common/domain"
import { UserId } from "../value-object/user-id"
import { UserDirection } from "../entities/directions/direction.entity"


export class UserDirectionUpdated extends DomainEvent {
    serialize(): string {
        let data= {  
            userId:this.userId.Value,
            userDirection:this.userDirection.map(direction=>({
                id: direction.getId().Value,
                name: direction.DirectionName.Value,
                favorite: direction.DirectionFavorite.Value,
                lat: direction.DirectionLat.Value,
                lng: direction.DirectionLng.Value   
            }))
        }
        return JSON.stringify(data)
    }
    static create(
        userId:UserId,
        userDirection:UserDirection[]
    ){
        return new UserDirectionUpdated(
            userId,
            userDirection
        )
    }
    constructor(
        public userId:UserId,
        public userDirection:UserDirection[]
    ){
        super()
    }
}