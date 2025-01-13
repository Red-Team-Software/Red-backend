import { DirectionId } from './../entities/directions/value-objects/direction-id';
import { DomainEvent } from "src/common/domain"
import { UserId } from "../value-object/user-id"


export class UserDirectionDeleted extends DomainEvent {
    serialize(): string {
        let data= {  
            userId:this.userId.Value,
            userDirection:{
                id: this.directionId.Value
            }  
        }
        return JSON.stringify(data)
    }
    static create(
        userId:UserId,
        directionId:DirectionId
    ){
        return new UserDirectionDeleted(
            userId,
            directionId
        )
    }
    constructor(
        public userId:UserId,
        public directionId:DirectionId
    ){
        super()
    }
}