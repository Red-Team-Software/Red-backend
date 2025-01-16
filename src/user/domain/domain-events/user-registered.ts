import { DomainEvent } from '../../../common/domain/domain-event/domain-event';
import { UserCoupon } from '../entities/coupon/user-coupon.entity';
import { Wallet } from '../entities/wallet/wallet.entity';
import { UserId } from '../value-object/user-id';
import { UserImage } from '../value-object/user-image';
import { UserName } from '../value-object/user-name';
import { UserPhone } from '../value-object/user-phone';
import { UserRole } from '../value-object/user-role';

export class UserRegistered extends DomainEvent {
    serialize(): string {
        let data= {  
            userId:this.userId.Value,
            userName:this.userName.Value,
            userPhone:this.userPhone.Value,  
            wallet:{
                walletId:this.Wallet.getId().Value, 
                ballance:{
                    currency:this.Wallet.Ballance.Currency,
                    amount:this.Wallet.Ballance.Amount
                }  
            },
            coupons:this.userCoupon
            ? this.userCoupon.map(c=>({
                id:c.getId().Value,
                state:c.CuponState.Value
            }))
            : [],
            userImage: this.userImage ? this.userImage.Value : undefined,
            userRole: this.userRole.Value       
        }
        return JSON.stringify(data)
    }
    static create(
        userId:UserId,
        userName:UserName,
        userPhone:UserPhone,
        userImage:UserImage,
        wallet:Wallet,
        userCoupon:UserCoupon[],
        userRole:UserRole
    ){
        return new UserRegistered(
            userId,
            userName,
            userPhone,
            userImage,
            wallet,
            userCoupon,
            userRole
        )
    }
    constructor(
        public userId:UserId,
        public userName:UserName,
        public userPhone:UserPhone,
        public userImage:UserImage,
        public Wallet:Wallet,
        public userCoupon:UserCoupon[],
        public userRole:UserRole,

    ){
        super()
    }
}