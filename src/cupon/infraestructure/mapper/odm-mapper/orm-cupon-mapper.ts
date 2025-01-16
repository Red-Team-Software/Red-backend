import { IMapper } from "src/common/application/mappers/mapper.interface";
import { Cupon } from "src/cupon/domain/aggregate/cupon.aggregate";
import { CuponId } from "src/cupon/domain/value-object/cupon-id";
import { CuponName } from "src/cupon/domain/value-object/cupon-name";
import { CuponCode } from "src/cupon/domain/value-object/cupon-code";
import { CuponDiscount } from "src/cupon/domain/value-object/cupon-discount";
import { CuponState } from "src/cupon/domain/value-object/cupon-state";
import { OdmCoupon } from "../../entities/odm-entities/odm-coupon-entity";

export class OdmCuponMapper implements IMapper<Cupon, OdmCoupon> {

    constructor(){}
    
    async fromDomaintoPersistence(domainEntity: Cupon): Promise<OdmCoupon> {
        throw new Error('not implemented')
    }

    async fromPersistencetoDomain(infraEntity: OdmCoupon): Promise<Cupon> {
        const cupon = Cupon.initializeAggregate(
            CuponId.create(infraEntity.id),
            CuponName.create(infraEntity.name),
            CuponCode.create(infraEntity.code),
            CuponDiscount.create(Number(infraEntity.discount)),
            CuponState.create(infraEntity.state)
        );
        return cupon;
    }
}
