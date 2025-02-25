import { DomainEvent } from "src/common/domain"
import { UserId } from "../value-object/user-id"
import { UserDirection } from "../entities/directions/direction.entity"


export class UserDirectionUpdated extends DomainEvent {
    serialize(): string {
        let data= {  
            userId:this.userId.Value,
            userDirection:{
                id: this.userDirection.getId().Value,
                name: this.userDirection.DirectionName.Value,
                favorite: this.userDirection.DirectionFavorite.Value,
                lat: this.userDirection.DirectionLat.Value,
                lng: this.userDirection.DirectionLng.Value    
            } 
        }
        return JSON.stringify(data)
    }
    static create(
        userId:UserId,
        userDirection:UserDirection
    ){
        return new UserDirectionUpdated(
            userId,
            userDirection
        )
    }
    constructor(
        public userId:UserId,
        public userDirection:UserDirection
    ){
        super()
    }
}