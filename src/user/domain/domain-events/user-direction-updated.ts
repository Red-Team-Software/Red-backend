import { DomainEvent } from "src/common/domain"
import { UserDirection } from "../value-object/user-direction"
import { UserId } from "../value-object/user-id"


export class UserDirectionUpdated extends DomainEvent {
    serialize(): string {
        let data= {  
            userId:this.userId.Value,
            userDirection:this.userDirection.map(direction=>({
                name: direction.Name,
                favorite: direction.Favorite,
                lat: direction.Lat,
                lng: direction.Lng   
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