import { AggregateRoot, DomainEvent } from "src/common/domain";
import { UserId } from "../value-object/user-id";
import { UserEmail } from "../value-object/user-email";
import { UserName } from "../value-object/user-name";
import { UserPhone } from "../value-object/user-phone";
import { UserRegistered } from '../domain-events/user-registered';
import { UserImage } from "../value-object/user-image";
import { UserDirection } from '../value-object/user-direction';
import { UserDirectionAdded } from "../domain-events/user-direction-added";
import { UserDirectionDeleted } from "../domain-events/user-direction-deleted";

export class User extends AggregateRoot <UserId>{
    protected when(event: DomainEvent): void {
        switch (event.getEventName){
            case 'UserRegistered':{
            const userRegistered: UserRegistered = event as UserRegistered
            this.userName=userRegistered.userName
            this.userPhone=userRegistered.userPhone
            }
            case 'UserDirectionAdded':{
                const userDirectionAdded: UserDirectionAdded = event as UserDirectionAdded
                this.UserDirections.push(userDirectionAdded.userDirection)
            }
            case 'UserDirectionDeleted':{
                const userDirectionDeleted: UserDirectionAdded = event as UserDirectionAdded
                this.UserDirections.filter(userDirection=>!userDirection.equals(userDirectionDeleted.userDirection))
            }
        }
    }
    protected validateState(): void {
    }
    private constructor(
        userId:UserId,
        private userName:UserName,
        private userPhone:UserPhone,
        private userImage?:UserImage,
        private userDirections?:UserDirection[]
    ){
        super(userId)
    }

    static RegisterUser(
        userId:UserId,
        userName:UserName,
        userPhone:UserPhone,
        userImage?:UserImage,
        userDirections?:UserDirection[]
    ):User{
        const user = new User(
            userId,
            userName,
            userPhone,
            userImage,
            userDirections,
        )
        user.apply(
            UserRegistered.create(
                userId,
                userName,
                userPhone,
                userImage
            )
        )
        return user
    }
    static initializeAggregate(
        userId:UserId,
        userName:UserName,
        userPhone:UserPhone,
        userImage?:UserImage,
        userDirection?:UserDirection[]
    ):User{
        const user = new User(
            userId,
            userName,
            userPhone,
            userImage,
            userDirection
        )
        user.validateState()
        return user
    }
    addDirection(direction:UserDirection):void{
        this.apply(
            UserDirectionAdded.create(
                this.getId(),
                direction
            )
        )    
    }
    deleteDirection(direction:UserDirection):void{
        this.apply(
            UserDirectionDeleted.create(
                this.getId(),
                direction
            )
        )    
    }
    get UserName():UserName {return this.userName}
    get UserPhone():UserPhone {return this.userPhone}
    get UserImage():UserImage {return this.userImage}
    get UserDirections():UserDirection[] {return this.userDirections}
}