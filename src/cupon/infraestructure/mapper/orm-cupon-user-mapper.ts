import { IMapper } from "src/common/application/mappers/mapper.interface";
import { CuponUser } from "src/cupon/domain/entities/cuponUser/cuponUser.entity";
import { OrmCuponUserEntity } from "../orm-entities/orm-cupon-user-entity";
import { CuponUserId } from "src/cupon/domain/entities/cuponUser/value-objects/cuponUserId";
import { CuponId } from "src/cupon/domain/value-object/cupon-id";
import { UserId } from "src/user/domain/value-object/user-id";
import { CuponDiscount } from "src/cupon/domain/value-object/cupon-discount";

export class OrmCuponUserMapper implements IMapper<CuponUser, OrmCuponUserEntity> {
    async fromPersistencetoDomain(ormEntity: OrmCuponUserEntity): Promise<CuponUser> {
        return new CuponUser(
            CuponUserId.create(ormEntity.user_id, ormEntity.cupon_id),
            UserId.create(ormEntity.user_id),
            CuponId.create(ormEntity.cupon_id),
            CuponDiscount.create(ormEntity.discount),
            ormEntity.isUsed
        );
    }

    async fromDomaintoPersistence(domainEntity: CuponUser): Promise<OrmCuponUserEntity> {
        return OrmCuponUserEntity.create(
            domainEntity.CuponUserId.Value,
            domainEntity.UserId.Value,
            domainEntity.CuponId.Value,
            domainEntity.Discount.Value,
            domainEntity.isCuponUsed()
        );
    }
}
