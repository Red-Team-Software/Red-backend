import { DomainEvent } from "src/common/domain"
import { UserDirection } from "../value-object/user-direction"
import { UserId } from "../value-object/user-id"


export class UserDirectionDeleted extends DomainEvent {
    serialize(): string {
        let data= {  
            userId:this.userId.Value,
            userDirection:{
                name: this.userDirection.Name,
                favorite: this.userDirection.Favorite,
                lat: this.userDirection.Lat,
                lng: this.userDirection.Lng            
            }  
        }
        return JSON.stringify(data)
    }
    static create(
        userId:UserId,
        userDirection:UserDirection
    ){
        return new UserDirectionDeleted(
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