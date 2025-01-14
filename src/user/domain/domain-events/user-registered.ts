import { DomainEvent } from '../../../common/domain/domain-event/domain-event';
import { UserCoupon } from '../entities/coupon/user-coupon.entity';
import { Wallet } from '../entities/wallet/wallet.entity';
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
            userImage: this.userImage ? this.userImage.Value : undefined       
        }
        return JSON.stringify(data)
    }
    static create(
        userId:UserId,
        userName:UserName,
        userPhone:UserPhone,
        userImage:UserImage,
        wallet:Wallet,
        userCoupon:UserCoupon[]
    ){
        return new UserRegistered(
            userId,
            userName,
            userPhone,
            userImage,
            wallet,
            userCoupon
        )
    }
    constructor(
        public userId:UserId,
        public userName:UserName,
        public userPhone:UserPhone,
        public userImage:UserImage,
        public Wallet:Wallet,
        public userCoupon:UserCoupon[]
    ){
        super()
    }
}