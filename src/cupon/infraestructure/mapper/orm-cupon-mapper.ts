import { IMapper } from "src/common/application/mappers/mapper.interface";
import { Cupon } from "src/cupon/domain/aggregate/cupon.aggregate";
import { OrmCuponEntity } from "../orm-entities/orm-cupon-entity";
import { OrmCuponUserEntity } from "../orm-entities/orm-cupon-user-entity";
import { CuponId } from "src/cupon/domain/value-object/cupon-id";
import { CuponName } from "src/cupon/domain/value-object/cupon-name";
import { CuponCode } from "src/cupon/domain/value-object/cupon-code";
import { CuponDiscount } from "src/cupon/domain/value-object/cupon-discount";
import { CuponState } from "src/cupon/domain/value-object/cupon-state";
import { CuponUser } from "src/cupon/domain/entities/cuponUser/cuponUser.entity";
import { CuponUserId } from "src/cupon/domain/entities/cuponUser/value-objects/cuponUserId";
import { IQueryUserRepository } from "src/user/application/repository/user.query.repository.interface";
import { UserId } from "src/user/domain/value-object/user-id";
import { NotFoundException } from "@nestjs/common";
import { IIdGen } from "src/common/application/id-gen/id-gen.interface";
import { CuponUserStateEnum } from "src/cupon/domain/entities/cuponUser/value-objects/cupon-state-enum";

export class OrmCuponMapper implements IMapper<Cupon, OrmCuponEntity> {
    constructor(
        private readonly idGen: IIdGen<string>,
        private readonly ormUserQueryRepository: IQueryUserRepository
    ) {}

    async fromPersistencetoDomain(infraEntity: OrmCuponEntity): Promise<Cupon> {
        const users: CuponUser[] = [];

        const ormUsers: OrmCuponUserEntity[] = infraEntity.cupon_users || [];

        for (let cuponUser of ormUsers) {
            const userId = UserId.create(cuponUser.user_id);
            const cuponId = CuponId.create(cuponUser.cupon_id);

            // Validar si el usuario existe en el sistema
            const userResponse = await this.ormUserQueryRepository.findUserById(userId);
            if (!userResponse.isSuccess()) {
                throw new NotFoundException(`User with ID ${cuponUser.user_id} not found`);
            }

            // Crear entidad CuponUser
            users.push(
                CuponUser.create(
                    CuponUserId.create(userId.Value, cuponId.Value),
                    userId,
                    cuponId,
                    CuponDiscount.create(cuponUser.discount),
                    CuponUserStateEnum.create(cuponUser.state)
                )
            );
        }

        // Inicializar el agregado Cupon
        return Cupon.initializeAggregate(
            CuponId.create(infraEntity.id),
            CuponName.create(infraEntity.name),
            CuponCode.create(infraEntity.code),
            CuponDiscount.create(Number(infraEntity.discount)),
            CuponState.create(infraEntity.state),
            users
        );
    }

    async fromDomaintoPersistence(domainEntity: Cupon): Promise<OrmCuponEntity> {
        const ormUsers: OrmCuponUserEntity[] = [];

        for (let cuponUser of domainEntity.CuponUsers || []) {
            ormUsers.push(
                OrmCuponUserEntity.create(
                    cuponUser.UserId.Value,
                    cuponUser.CuponId.Value,
                    cuponUser.CuponUserId.Value,
                    cuponUser.Discount.Value,
                    cuponUser.State.Value
                )
            );
        }

        // Retornar la entidad de persistencia con usuarios asociados
        return {
            id: domainEntity.getId().Value,
            name: domainEntity.CuponName.Value,
            code: domainEntity.CuponCode.Value,
            discount: domainEntity.CuponDiscount.Value,
            state: domainEntity.CuponState.Value,
            cupon_users: ormUsers
        };
    }
}
