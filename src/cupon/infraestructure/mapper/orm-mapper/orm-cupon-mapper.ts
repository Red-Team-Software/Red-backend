import { IMapper } from "src/common/application/mappers/mapper.interface";
import { Cupon } from "src/cupon/domain/aggregate/cupon.aggregate";
import { OrmCuponEntity } from "../../entities/orm-entities/orm-cupon-entity";
import { CuponId } from "src/cupon/domain/value-object/cupon-id";
import { CuponName } from "src/cupon/domain/value-object/cupon-name";
import { CuponCode } from "src/cupon/domain/value-object/cupon-code";
import { CuponDiscount } from "src/cupon/domain/value-object/cupon-discount";
import { CuponState } from "src/cupon/domain/value-object/cupon-state";
import { IIdGen } from "src/common/application/id-gen/id-gen.interface";

export class OrmCuponMapper implements IMapper<Cupon, OrmCuponEntity> {
    constructor(
        private readonly idGen: IIdGen<string>
    ) {}

    async fromPersistencetoDomain(infraEntity: OrmCuponEntity): Promise<Cupon> {
        // Inicializar el agregado Cupon
        return Cupon.initializeAggregate(
            CuponId.create(infraEntity.id),
            CuponName.create(infraEntity.name),
            CuponCode.create(infraEntity.code),
            CuponDiscount.create(Number(infraEntity.discount)),
            CuponState.create(infraEntity.state)
        );
    }

    async fromDomaintoPersistence(domainEntity: Cupon): Promise<OrmCuponEntity> {

        // Retornar la entidad de persistencia con usuarios asociados
        return {
            id: domainEntity.getId().Value,
            name: domainEntity.CuponName.Value,
            code: domainEntity.CuponCode.Value,
            discount: domainEntity.CuponDiscount.Value,
            state: domainEntity.CuponState.Value
        };
    }
}
