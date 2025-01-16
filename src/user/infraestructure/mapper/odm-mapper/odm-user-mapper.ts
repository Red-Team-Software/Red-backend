import { IMapper } from "src/common/application/mappers/mapper.interface"
import { User } from "src/user/domain/aggregate/user.aggregate"
import { UserId } from "src/user/domain/value-object/user-id"
import { UserImage } from "src/user/domain/value-object/user-image"
import { UserName } from "src/user/domain/value-object/user-name"
import { UserPhone } from "src/user/domain/value-object/user-phone"
import { UserRole } from "src/user/domain/value-object/user-role"
import { UserRoles } from "src/user/domain/value-object/enum/user.roles"
import { IIdGen } from "src/common/application/id-gen/id-gen.interface"
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
import { OdmUserEntity } from "../../entities/odm-entities/odm-user-entity"


export class OdmUserMapper implements IMapper <User,OdmUserEntity>{

    constructor(){}

    async fromDomaintoPersistence(domainEntity: User): Promise<OdmUserEntity> {
        throw new Error('')
    }
    async fromPersistencetoDomain(infraEstructure: OdmUserEntity): Promise<User> {


        let user=User.initializeAggregate(
            UserId.create(infraEstructure.id),
            UserName.create(infraEstructure.name),
            UserPhone.create(infraEstructure.phone),
            UserRole.create(infraEstructure.type),
            infraEstructure.direction
            ? infraEstructure.direction.map(odmdirection=>
                UserDirection.create(
                    DirectionId.create(odmdirection.id),
                    DirectionFavorite.create(odmdirection.favorite),
                    DirectionLat.create(odmdirection.lat),
                    DirectionLng.create(odmdirection.lng),
                    DirectionName.create(odmdirection.name)
                ))
            : [],
            Wallet.create(
                WalletId.create(infraEstructure.wallet.id),
                Ballance.create(
                    infraEstructure.wallet.id
                    ? Number(Number(infraEstructure.wallet.amount).toFixed(2))
                    : 0
                    , infraEstructure.wallet.currency,
                )
            ),
            infraEstructure.coupon
            ? infraEstructure.coupon.map(c=>            
                UserCoupon.create(
                CuponId.create(c.id),
                CuponState.create(c.state)
            ))
            : [],
            infraEstructure.image ? UserImage.create(infraEstructure.image) : undefined
        )
        return user
    }
}