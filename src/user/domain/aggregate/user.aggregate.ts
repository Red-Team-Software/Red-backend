import { AggregateRoot, DomainEvent } from "src/common/domain";
import { UserId } from "../value-object/user-id";
import { UserName } from "../value-object/user-name";
import { UserPhone } from "../value-object/user-phone";
import { UserRegistered } from '../domain-events/user-registered';
import { UserImage } from "../value-object/user-image";
import { UserDirectionAdded } from "../domain-events/user-direction-added";
import { UserDirectionDeleted } from "../domain-events/user-direction-deleted";
import { DomainExceptionNotHandled } from "src/common/domain/domain-exception-not-handled/domain-exception-not-handled";
import { UserRole } from "../value-object/user-role";
import { InvalidUserException } from "../domain-exceptions/invalid-user-exception";
import { UserImageUpdated } from "../domain-events/user-image-updated";
import { UserNameUpdated } from "../domain-events/user-name-updated";
import { UserPhoneUpdated } from "../domain-events/user-phone-updated";
import { UserDirectionUpdated } from "../domain-events/user-direction-updated";
import { Wallet } from "../entities/wallet/wallet.entity";
import { InvalidUserDirectionQuantityException } from "../domain-exceptions/invalid-user-direction-quantity-exception";
import { UserBalanceAmountAdded } from "../domain-events/user-balance-amount-added";
import { UserBalanceAmountDecremented } from "../domain-events/user-balance-amount-decremented";
import { Ballance } from "../entities/wallet/value-objects/balance";
import { UserDirection } from "../entities/directions/direction.entity"
import { DirectionId } from "../entities/directions/value-objects/Direction-id";
import { UserCoupon } from "../entities/coupon/user-coupon.entity";


export class User extends AggregateRoot <UserId>{
    protected when(event: DomainEvent): void {
        switch (event.getEventName){
            case 'UserRegistered':{
            const userRegistered: UserRegistered = event as UserRegistered
            this.userName=userRegistered.userName
            this.userPhone=userRegistered.userPhone
            break;
            }
            case 'UserDirectionAdded':{
                const userDirectionAdded: UserDirectionAdded = event as UserDirectionAdded
                this.UserDirections.push(userDirectionAdded.userDirection)
                if(this.UserDirections.length>6)
                    throw new InvalidUserDirectionQuantityException(this.userDirections.length)
                break;
            }
            case 'UserDirectionDeleted':{
                const userDirectionDeleted: UserDirectionDeleted = event as UserDirectionDeleted
                this.userDirections = this.userDirections.filter(
                    userDirection => !userDirection.getId().equals(userDirectionDeleted.directionId)
                )
                break;
            }
            case 'UserDirectionUpdated':{
                const userDirectionUpdated: UserDirectionUpdated = event as UserDirectionUpdated
                this.userDirections = this.userDirections.filter(direction =>
                    !direction.equals(userDirectionUpdated.userDirection)
                )
                this.userDirections.unshift(userDirectionUpdated.userDirection)
                break;
            }
            case 'UserImageUpdated':{
                const userImageUpdated: UserImageUpdated = event as UserImageUpdated
                this.userImage=userImageUpdated.userImage
                break;
            }
            case 'UserNameUpdated':{
                const userNameUpdated: UserNameUpdated = event as UserNameUpdated
                this.userName=userNameUpdated.userName
                break;
            }
            case 'UserPhoneUpdated':{
                const userPhoneUpdated: UserPhoneUpdated = event as UserPhoneUpdated
                this.userPhone=userPhoneUpdated.userPhone
                break;
            }
            case 'UserBalanceAmountAdded':{
                const userBalanceAmountAdded: UserBalanceAmountAdded = event as UserBalanceAmountAdded
                this.wallet= userBalanceAmountAdded.userWallet
                break;
            }
            case 'UserBalanceAmountDecremented':{                    
                const userBalanceAmountDecremented: UserBalanceAmountDecremented = event as UserBalanceAmountDecremented
                this.wallet= userBalanceAmountDecremented.userWallet
                break;
            }
            default: { throw new DomainExceptionNotHandled(JSON.stringify(event)) }
        }
    }
    protected validateState(): void {
        if(
            !this.getId() ||
            !this.userName ||
            !this.UserPhone ||
            !this.userRole ||
            !this.userDirections ||
            this.userDirections.length>6
        )
        throw new InvalidUserException()

    }
    private constructor(
        userId:UserId,
        private userName:UserName,
        private userPhone:UserPhone,
        private userRole:UserRole,
        private userDirections:UserDirection[],
        private wallet:Wallet,
        private userCoupon:UserCoupon[],
        private userImage?:UserImage,
    ){
        super(userId)
    }

    static RegisterUser(
        userId:UserId,
        userName:UserName,
        userPhone:UserPhone,
        userRole:UserRole,
        userDirections:UserDirection[],
        wallet:Wallet,
        userCoupon:UserCoupon[],
        userImage?:UserImage,
    ):User{
        const user = new User(
            userId,
            userName,
            userPhone,
            userRole,
            userDirections,
            wallet,
            userCoupon,
            userImage
        )
        user.apply(
            UserRegistered.create(
                userId,
                userName,
                userPhone,
                userImage,
                wallet
            )
        )
        return user
    }
    static initializeAggregate(
        userId:UserId,
        userName:UserName,
        userPhone:UserPhone,
        userRole:UserRole,
        userDirection:UserDirection[],
        wallet:Wallet,
        userCoupon:UserCoupon[],
        userImage?:UserImage,
    ):User{
        const user = new User(
            userId,
            userName,
            userPhone,
            userRole,
            userDirection,
            wallet,
            userCoupon,
            userImage
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
        this.validateState()  
    }

    deleteDirection(direction:DirectionId):void{
        this.apply(
            UserDirectionDeleted.create(
                this.getId(),
                direction
            )
        )    
    }

    updateImage(userImage:UserImage):void{
        this.apply(
            UserImageUpdated.create(
                this.getId(),
                userImage
            )
        )
    }

    addWalletBalance(ballance:Ballance):void{
        this.apply(
            UserBalanceAmountAdded.create(
                this.getId(),
                this.wallet.addAmountToBalance(ballance)
            )
        );
    };

    decreaseWalletBalance(ballance:Ballance):void{
        this.apply(
            UserBalanceAmountDecremented.create(
                this.getId(),
                this.wallet.reduceAmountToBalance(ballance)
            )
        );
    };

    updateName(userName:UserName){
        this.apply(
            UserNameUpdated.create(
                this.getId(),
                userName
            )
        )
    }
    updatePhone(userPhone:UserPhone){
        this.apply(
            UserPhoneUpdated.create(
                this.getId(),
                userPhone
            )
        )
    }
    updateDirection(direction:UserDirection):void{
        this.apply(
            UserDirectionUpdated.create(
                this.getId(),
                direction
            )
        )    
    }    
    get UserName():UserName {return this.userName}
    get UserPhone():UserPhone {return this.userPhone}
    get UserImage():UserImage {return this.userImage}
    get UserDirections():UserDirection[] {return this.userDirections}
    get UserRole():UserRole{ return this.userRole}
    get Wallet():Wallet{return this.wallet}
    get UserCoupon():UserCoupon[]{return this.userCoupon}
}