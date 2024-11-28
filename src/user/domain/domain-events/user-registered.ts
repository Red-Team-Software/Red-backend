import { DomainEvent } from '../../../common/domain/domain-event/domain-event';
import { UserEmail } from '../value-object/user-email';
import { UserId } from '../value-object/user-id';
import { UserImage } from '../value-object/user-image';
import { UserName } from '../value-object/user-name';
import { UserPhone } from '../value-object/user-phone';

export class UserRegistered extends DomainEvent {
    serialize(): string {
        let data= {  
            userId:this.userId.Value,
            userName:this.userName.Value,
            userEmail:this.userEmail.Value,      
            userPhone:this.userPhone.Value,  
            userImage: this.userImage ? this.userImage.Value : undefined        }
        return JSON.stringify(data)
    }
    static create(
        userId:UserId,
        userEmail:UserEmail,
        userName:UserName,
        userPhone:UserPhone,
        userImage:UserImage
    ){
        return new UserRegistered(
            userId,
            userEmail,
            userName,
            userPhone,
            userImage
        )
    }
    constructor(
        public userId:UserId,
        public userEmail:UserEmail,
        public userName:UserName,
        public userPhone:UserPhone,
        public userImage:UserImage
    ){
        super()
    }
}