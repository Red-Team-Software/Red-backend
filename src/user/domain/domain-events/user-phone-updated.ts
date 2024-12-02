import { DomainEvent } from '../../../common/domain/domain-event/domain-event';
import { UserId } from '../value-object/user-id';
import { UserPhone } from '../value-object/user-phone';

export class UserPhoneUpdated extends DomainEvent {
    serialize(): string {
        let data= {  
            userId:this.userId.Value,
            userPhone:this.userPhone.Value,      
        }
        return JSON.stringify(data)
    }
    static create(
        userId:UserId,
        userPhone:UserPhone
    ){
        return new UserPhoneUpdated(
            userId,
            userPhone
        )
    }
    constructor(
        public userId:UserId,
        public userPhone:UserPhone
    ){
        super()
    }
}