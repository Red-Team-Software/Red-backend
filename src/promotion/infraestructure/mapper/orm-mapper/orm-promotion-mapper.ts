import { IIdGen } from "src/common/application/id-gen/id-gen.interface";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { Promotion } from "src/promotion/domain/aggregate/promotion.aggregate";
import { OrmPromotionEntity } from "../../entities/orm-entities/orm-promotion-entity";
import { OrmProductEntity } from 'src/product/infraestructure/entities/orm-entities/orm-product-entity';
import { DataSource, Repository } from "typeorm";
import { OrmBundleEntity } from "src/bundle/infraestructure/entities/orm-entities/orm-bundle-entity";
import { PromotionId } from "src/promotion/domain/value-object/promotion-id";
import { PromotionDescription } from "src/promotion/domain/value-object/promotion-description";
import { PromotionName } from "src/promotion/domain/value-object/promotion-name";
import { PromotionAvaleableState } from "src/promotion/domain/value-object/promotion-avaleable-state";
import { PromotionDiscount } from "src/promotion/domain/value-object/promotion-discount";
import { ProductID } from "src/product/domain/value-object/product-id";
import { BundleId } from "src/bundle/domain/value-object/bundle-id";


export class OrmPromotionMapper implements IMapper <Promotion,OrmPromotionEntity>{

    private readonly ormProductRepository:Repository<OrmProductEntity>
    private readonly ormBundleRepository:Repository<OrmBundleEntity>

    constructor(
        private readonly idGen:IIdGen<string>,
        dataSource:DataSource
    ){
        this.ormProductRepository=dataSource.getRepository(OrmProductEntity)
        this.ormBundleRepository=dataSource.getRepository(OrmBundleEntity)
    }
    async fromPersistencetoDomain(infraEstructure: OrmPromotionEntity): Promise<Promotion> {

        return Promotion.initializeAggregate(
            PromotionId.create(infraEstructure.id),
            PromotionDescription.create(infraEstructure.description),
            PromotionName.create(infraEstructure.name),
            PromotionAvaleableState.create(infraEstructure.avaleableState),
            PromotionDiscount.create(Number(infraEstructure.discount)),
            infraEstructure.products.map(id=>ProductID.create(id.id)),
            infraEstructure.bundles.map(id=>BundleId.create(id.id)),
            []
        )
    }
    async fromDomaintoPersistence(domainEntity: Promotion): Promise<OrmPromotionEntity> {

        let ormProducts:OrmProductEntity[]=[]
        let ormBundles:OrmBundleEntity[]=[]

        for (const bundle of domainEntity.Bundles){
            let response=await this.ormBundleRepository.findOneBy({id:bundle.Value})
            if (response) ormBundles.push(response)
        }

        for (const product of domainEntity.Products){
            let response=await this.ormProductRepository.findOneBy({id:product.Value})
            if (response) ormProducts.push(response)
        }

        return OrmPromotionEntity.create(
            domainEntity.getId().Value,
            domainEntity.PromotionDescription.Value,
            domainEntity.PromotionName.Value,
            domainEntity.PromotionAvaleableState.Value,
            domainEntity.PromotionDiscounts.Value,
            ormProducts,
            ormBundles
        )

        
    }

}