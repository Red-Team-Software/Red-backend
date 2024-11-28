import { AggregateRoot, DomainEvent } from "src/common/domain";
import { UserId } from "../value-object/user-id";
import { UserEmail } from "../value-object/user-email";
import { UserName } from "../value-object/user-name";
import { UserPhone } from "../value-object/user-phone";
import { UserRegistered } from '../domain-events/user-registered';
import { UserImage } from "../value-object/user-image";

export class User extends AggregateRoot <UserId>{
    protected when(event: DomainEvent): void {
        switch (event.getEventName){
            case 'UserRegistered':
            const userRegistered: UserRegistered = event as UserRegistered
            this.userEmail=userRegistered.userEmail
            this.userName=userRegistered.userName
            this.userPhone=userRegistered.userPhone
        }
    }
    protected validateState(): void {
    }
    private constructor(
        userId:UserId,
        private userEmail:UserEmail,
        private userName:UserName,
        private userPhone:UserPhone,
        private userImage?:UserImage
    ){
        super(userId)
    }

    static RegisterUser(
        userId:UserId,
        userEmail:UserEmail,
        userName:UserName,
        userPhone:UserPhone,
        userImage?:UserImage
    ):User{
        const user = new User(
            userId,
            userEmail,
            userName,
            userPhone,
            userImage
        )
        user.apply(
            UserRegistered.create(
                userId,
                userEmail,
                userName,
                userPhone,
                userImage
            )
        )
        return user
    }
    static initializeAggregate(
        userId:UserId,
        userEmail:UserEmail,
        userName:UserName,
        userPhone:UserPhone,
        userImage?:UserImage
    ):User{
        const user = new User(
            userId,
            userEmail,
            userName,
            userPhone,
            userImage
        )
        user.validateState()
        return user
    }
    get UserEmail():UserEmail{return this.userEmail}
    get UserName():UserName {return this.userName}
    get UserPhone():UserPhone {return this.userPhone}
    get UserImage():UserImage {return this.userImage}
}