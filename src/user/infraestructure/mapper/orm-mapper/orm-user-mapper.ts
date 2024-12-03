import { OrmDirectionEntity } from './../../entities/orm-entities/orm-direction-entity';
import { IMapper } from "src/common/application/mappers/mapper.interface"
import { User } from "src/user/domain/aggregate/user.aggregate"
import { UserId } from "src/user/domain/value-object/user-id"
import { UserImage } from "src/user/domain/value-object/user-image"
import { UserName } from "src/user/domain/value-object/user-name"
import { OrmUserEntity } from "../../entities/orm-entities/orm-user-entity"
import { UserPhone } from "src/user/domain/value-object/user-phone"
import { UserRole } from "src/user/domain/value-object/user-role"
import { UserRoles } from "src/user/domain/value-object/enum/user.roles"
import { UserDirection } from "src/user/domain/value-object/user-direction"
import { IIdGen } from "src/common/application/id-gen/id-gen.interface"
import { OrmDirectionUserEntity } from "../../entities/orm-entities/orm-direction-user-entity"
import { IQueryUserRepository } from 'src/user/application/repository/user.query.repository.interface';
import { Wallet } from 'src/user/domain/entities/wallet/wallet.entity';
import { WalletId } from 'src/user/domain/entities/wallet/value-objects/wallet-id';
import { Ballance } from 'src/user/domain/entities/wallet/value-objects/balance';
import { OrmWalletEntity } from '../../entities/orm-entities/orm-wallet-entity';


export class OrmUserMapper implements IMapper <User,OrmUserEntity>{

    constructor(
        private readonly IdGen:IIdGen<string>,
        private readonly userQueryRepository:IQueryUserRepository
    ){}

    async fromDomaintoPersistence(domainEntity: User): Promise<OrmUserEntity> {

        let ormDirectionEntities:OrmDirectionEntity[]=[]
        let ormDirectionUserEntities:OrmDirectionUserEntity[]=[]

        let ormWallet=OrmWalletEntity.create(
            domainEntity.Wallet.getId().Value,
            domainEntity.Wallet.Ballance.Currency,
            domainEntity.Wallet.Ballance.Amount
        )

        let directionsResponse=await this.userQueryRepository.findDirectionsByLatAndLng(domainEntity.UserDirections)

        if (!directionsResponse.isSuccess())
            throw directionsResponse.getError

        const directions=directionsResponse.getValue

        let data= OrmUserEntity.create(
            domainEntity.getId().Value,
            domainEntity.UserName.Value,
            domainEntity.UserPhone.Value,
            domainEntity.UserRole.Value as UserRoles,
            ormWallet,
            domainEntity.UserImage ? domainEntity.UserImage.Value : undefined,
        )

        for (const direction of domainEntity.UserDirections){
            let directionFound= directions.find(ormDirection=>
                ormDirection.lat==direction.Lat &&
                ormDirection.lng==direction.Lng
            )

            let id = directionFound ? directionFound.id : await this.IdGen.genId()
            
            let ormDirection=OrmDirectionEntity.create(id,direction.Lat,direction.Lng)
            ormDirectionEntities.push(ormDirection)

            ormDirectionUserEntities.push(
                OrmDirectionUserEntity.create(
                    domainEntity.getId().Value,
                    id,
                    direction.Favorite,
                    direction.Name,
                    ormDirection
                )
            )
        }

        data.direcction=ormDirectionUserEntities

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
                UserDirection.create(ormdirection.name, ormdirection.favorite,ormdirection.lat,ormdirection.lng))
            : [],
            Wallet.create(
                WalletId.create(infraEstructure.wallet.id),
                Ballance.create(infraEstructure.wallet.price,infraEstructure.wallet.currency)
            ),
            infraEstructure.image ? UserImage.create(infraEstructure.image) : undefined
        )
        return user
    }
}