import { DomainEvent } from "src/common/domain"
import { UserId } from "../value-object/user-id"
import { UserImage } from "../value-object/user-image"


export class UserImageUpdated extends DomainEvent {
    serialize(): string {
        let data= {  
            userId:this.userId.Value,
            userImage:this.userImage.Value
        }
        return JSON.stringify(data)
    }
    static create(
        userId:UserId,
        userImage:UserImage
    ){
        return new UserImageUpdated(
            userId,
            userImage
        )
    }
    constructor(
        public userId:UserId,
        public userImage:UserImage
    ){
        super()
    }
}