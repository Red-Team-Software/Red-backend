import { IMapper } from "src/common/application/mappers/mapper.interface"
import { User } from "src/user/domain/aggregate/user.aggregate"
import { UserId } from "src/user/domain/value-object/user-id"
import { UserImage } from "src/user/domain/value-object/user-image"
import { UserName } from "src/user/domain/value-object/user-name"
import { OrmUserEntity } from "../../entities/orm-entities/orm-user-entity"
import { UserPhone } from "src/user/domain/value-object/user-phone"
import { UserRole } from "src/user/domain/value-object/user-role"
import { UserRoles } from "src/user/domain/value-object/enum/user.roles"
import { IIdGen } from "src/common/application/id-gen/id-gen.interface"
import { OrmDirectionUserEntity } from "../../entities/orm-entities/orm-direction-user-entity"
import { IQueryUserRepository } from 'src/user/application/repository/user.query.repository.interface';
import { Wallet } from 'src/user/domain/entities/wallet/wallet.entity';
import { WalletId } from 'src/user/domain/entities/wallet/value-objects/wallet-id';
import { Ballance } from 'src/user/domain/entities/wallet/value-objects/balance';
import { OrmWalletEntity } from '../../entities/orm-entities/orm-wallet-entity';
import { UserDirection } from 'src/user/domain/entities/directions/direction.entity';
import { DirectionId } from 'src/user/domain/entities/directions/value-objects/direction-id';import { DirectionFavorite } from 'src/user/domain/entities/directions/value-objects/direction-favorite';
import { DirectionLat } from 'src/user/domain/entities/directions/value-objects/direction-lat';
import { DirectionLng } from 'src/user/domain/entities/directions/value-objects/direction-lng';
import { DirectionName } from 'src/user/domain/entities/directions/value-objects/direction-name';
import { UserCoupon } from "src/user/domain/entities/coupon/user-coupon.entity"
import { CuponId } from "src/cupon/domain/value-object/cupon-id"
import { CuponState } from "src/user/domain/entities/coupon/value-objects/cupon-state"
import { OrmCuponEntity } from "src/cupon/infraestructure/entities/orm-entities/orm-cupon-entity"
import { OrmCuponUserEntity } from "../../entities/orm-entities/orm-coupon-user-entity"


export class OrmUserMapper implements IMapper <User,OrmUserEntity>{

    constructor(
        private readonly IdGen:IIdGen<string>,
        private readonly userQueryRepository:IQueryUserRepository
    ){}

    async fromDomaintoPersistence(domainEntity: User): Promise<OrmUserEntity> {

        let ormDirectionUserEntities:OrmDirectionUserEntity[]=[]
        let ormUserCupon:OrmCuponUserEntity[]=[]

        let ormWallet=OrmWalletEntity.create(
            domainEntity.Wallet.getId().Value,
            domainEntity.Wallet.Ballance.Currency,
            domainEntity.Wallet.Ballance.Amount
            ? Number(domainEntity.Wallet.Ballance.Amount.toFixed(2))
            : 0
        )

        if(domainEntity.UserDirections)
            for (const direction of domainEntity.UserDirections){
                ormDirectionUserEntities.push(
                    OrmDirectionUserEntity.create(
                        domainEntity.getId().Value,
                        direction.getId().Value,
                        direction.DirectionFavorite.Value,
                        direction.DirectionName.Value,
                        direction.DirectionLat.Value,
                        direction.DirectionLng.Value
                    )
                )
            }

        if (domainEntity.UserCoupon)
            for (const coupon of domainEntity.UserCoupon){
                ormUserCupon.push(OrmCuponUserEntity.create(
                    domainEntity.getId().Value,
                    coupon.getId().Value,
                    coupon.CuponState.Value
                ))
            }

        let data= OrmUserEntity.create(
            domainEntity.getId().Value,
            domainEntity.UserName.Value,
            domainEntity.UserPhone.Value,
            domainEntity.UserRole.Value as UserRoles,
            ormWallet,
            ormUserCupon ? ormUserCupon : [],
            ormDirectionUserEntities ? ormDirectionUserEntities : [],
            domainEntity.UserImage ? domainEntity.UserImage.Value : undefined,
        )
        return data

    }
    async fromPersistencetoDomain(infraEstructure: OrmUserEntity): Promise<User> {

        let direction=await this.userQueryRepository.findUserDirectionsByUserId(UserId.create(infraEstructure.id))

        let user=User.initializeAggregate(
            UserId.create(infraEstructure.id),
            UserName.create(infraEstructure.name),
            UserPhone.create(infraEstructure.phone),
            UserRole.create(infraEstructure.type),
            direction.isSuccess() 
            ? direction.getValue.map(ormdirection=>
                UserDirection.create(
                    DirectionId.create(ormdirection.id),
                    DirectionFavorite.create(ormdirection.isFavorite),
                    DirectionLat.create(ormdirection.lat),
                    DirectionLng.create(ormdirection.lng),
                    DirectionName.create(ormdirection.name)
                ))
            : [],
            Wallet.create(
                WalletId.create(infraEstructure.wallet.id),
                Ballance.create(
                    infraEstructure.wallet.price
                    ? Number(Number(infraEstructure.wallet.price).toFixed(2))
                    : 0
                    , infraEstructure.wallet.currency,
                )
            ),
            infraEstructure.cupons
            ? infraEstructure.cupons.map(c=>            
                UserCoupon.create(
                CuponId.create(c.cupon_id),
                CuponState.create(c.state)
            ))
            : [],
            infraEstructure.image ? UserImage.create(infraEstructure.image) : undefined
        )
        return user
    }
}