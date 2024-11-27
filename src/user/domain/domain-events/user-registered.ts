import { DomainEvent } from '../../../common/domain/domain-event/domain-event';
import { UserEmail } from '../value-object/user-email';
import { UserId } from '../value-object/user-id';
import { UserName } from '../value-object/user-name';
import { UserPhone } from '../value-object/user-phone';

export class UserRegistered extends DomainEvent {
    serialize(): string {
        let data= {  
            userId:this.userId.Value,
            userName:this.userName.Value,
            userEmail:this.userEmail.Value,      
            userPhone:this.userPhone.Value,      
        }
        return JSON.stringify(data)
    }
    static create(
        userId:UserId,
        userEmail:UserEmail,
        userName:UserName,
        userPhone:UserPhone
    ){
        return new UserRegistered(
            userId,
            userEmail,
            userName,
            userPhone
        )
    }
    constructor(
        public userId:UserId,
        public userEmail:UserEmail,
        public userName:UserName,
        public userPhone:UserPhone
    ){
        super()
    }
}