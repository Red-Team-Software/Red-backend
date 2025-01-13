import { DomainEvent } from "src/common/domain"
import { UserId } from "../value-object/user-id"
import { UserDirection } from "../entities/directions/direction.entity"


export class UserDirectionAdded extends DomainEvent {
    serialize(): string {
        let data= {  
            userId:this.userId.Value,
            userDirection:{
                id: this.userDirection.getId().Value,
                name: this.userDirection.DirectionName,
                favorite: this.userDirection.DirectionFavorite,
                lat: this.userDirection.DirectionLat,
                lng: this.userDirection.DirectionLng    
            }  
        }
        return JSON.stringify(data)
    }
    static create(
        userId:UserId,
        userDirection:UserDirection
    ){
        return new UserDirectionAdded(
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