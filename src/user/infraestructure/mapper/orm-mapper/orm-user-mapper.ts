import { IMapper } from "src/common/application/mappers/mapper.interface"
import { ProductID } from "src/product/domain/value-object/product-id"
import { User } from "src/user/domain/aggregate/user.aggregate"
import { UserId } from "src/user/domain/value-object/user-id"
import { UserImage } from "src/user/domain/value-object/user-image"
import { UserName } from "src/user/domain/value-object/user-name"
import { OrmUserEntity } from "../../entities/orm-entities/orm-user-entity"
import { UserPhone } from "src/user/domain/value-object/user-phone"
import { UserRole } from "src/user/domain/value-object/user-role"
import { UserRoles } from "src/user/domain/value-object/enum/user.roles"
import { UserDirection } from "src/user/domain/value-object/user-direction"


export class OrmUserMapper implements IMapper <User,OrmUserEntity>{

    async fromDomaintoPersistence(domainEntity: User): Promise<OrmUserEntity> {

        let data= OrmUserEntity.create(
            domainEntity.getId().Value,
            domainEntity.UserName.Value,
            domainEntity.UserPhone.Value,
            domainEntity.UserRole.Value as UserRoles,
            domainEntity.UserImage ? domainEntity.UserImage.Value : undefined,
        )
        return data
    }
    async fromPersistencetoDomain(infraEstructure: OrmUserEntity): Promise<User> {

        let user=User.initializeAggregate(
            UserId.create(infraEstructure.id),
            UserName.create(infraEstructure.name),
            UserPhone.create(infraEstructure.phone),
            UserRole.create(infraEstructure.type),
            infraEstructure.direcction 
            ? infraEstructure.direcction.map(ormdirection=>
                UserDirection.create(ormdirection.name, ormdirection.isFavorite,1 ,1))
            : [],
            infraEstructure.image ? UserImage.create(infraEstructure.image) : undefined
        )
        return user
    }
}