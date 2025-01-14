import { IMapper } from "src/common/application/mappers/mapper.interface";
import { Promotion } from "src/promotion/domain/aggregate/promotion.aggregate";
import { PromotionId } from "src/promotion/domain/value-object/promotion-id";
import { PromotionDescription } from "src/promotion/domain/value-object/promotion-description";
import { PromotionName } from "src/promotion/domain/value-object/promotion-name";
import { PromotionDiscount } from "src/promotion/domain/value-object/promotion-discount";
import { ProductID } from "src/product/domain/value-object/product-id";
import { BundleId } from "src/bundle/domain/value-object/bundle-id";
import { PromotionState } from "src/promotion/domain/value-object/promotion-state";
import { OdmPromotionEntity } from "../../entities/odm-entities/odm-promotion-entity";


export class OdmPromotionMapper implements IMapper <Promotion,OdmPromotionEntity>{

    constructor(){}

    async fromPersistencetoDomain(infraEstructure: OdmPromotionEntity): Promise<Promotion> {
        
        return Promotion.initializeAggregate(
            PromotionId.create(infraEstructure.id),
            PromotionDescription.create(infraEstructure.description),
            PromotionName.create(infraEstructure.name),
            PromotionState.create(infraEstructure.state),
            PromotionDiscount.create(Number(infraEstructure.discount)),
            infraEstructure.products
            ? infraEstructure.products.map(id=>ProductID.create(id.id))
            : [],
            infraEstructure.bundles
            ? infraEstructure.bundles.map(id=>BundleId.create(id.id))
            : [],
            []
        )
    }
    async fromDomaintoPersistence(domainEntity: Promotion): Promise<OdmPromotionEntity> {
        throw new Error('method not implemented')
        
    }

}