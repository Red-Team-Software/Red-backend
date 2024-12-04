import { IIdGen } from "src/common/application/id-gen/id-gen.interface";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { Promotion } from "src/promotion/domain/aggregate/promotion.aggregate";
import { OrmPromotionEntity } from "../../entities/orm-entities/orm-promotion-entity";
import { OrmProductEntity } from 'src/product/infraestructure/entities/orm-entities/orm-product-entity';
import { Repository } from "typeorm";
import { OrmBundleEntity } from "src/bundle/infraestructure/entities/orm-entities/orm-bundle-entity";


export class OrmPromotionMapper implements IMapper <Promotion,OrmPromotionEntity>{

    private readonly ormProductRepository:Repository<OrmProductEntity>
    private readonly ormBundleRepository:Repository<OrmBundleEntity>

    constructor(
        private readonly idGen:IIdGen<string>
    ){}
    async fromPersistencetoDomain(infraEstructure: OrmPromotionEntity): Promise<Promotion> {
        throw new Error("Method not implemented.");
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