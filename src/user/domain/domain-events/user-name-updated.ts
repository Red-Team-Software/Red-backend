import { DomainEvent } from "src/common/domain"
import { UserId } from "../value-object/user-id"
import { UserName } from "../value-object/user-name"

export class UserNameUpdated extends DomainEvent {
    serialize(): string {
        let data= {  
            userId:this.userId.Value,
            userName:this.userName.Value,
        }
        return JSON.stringify(data)
    }
    static create(
        userId:UserId,
        userName:UserName,
    ){
        return new UserNameUpdated(
            userId,
            userName,
        )
    }
    constructor(
        public userId:UserId,
        public userName:UserName,
    ){
        super()
    }
}