import { Bundle } from "src/bundle/domain/aggregate/bundle.aggregate"
import { BundleCaducityDate } from "src/bundle/domain/value-object/bundle-caducity-date"
import { BundleDescription } from "src/bundle/domain/value-object/bundle-description"
import { BundleId } from "src/bundle/domain/value-object/bundle-id"
import { BundleImage } from "src/bundle/domain/value-object/bundle-image"
import { BundleName } from "src/bundle/domain/value-object/bundle-name"
import { BundlePrice } from "src/bundle/domain/value-object/bundle-price"
import { BundleStock } from "src/bundle/domain/value-object/bundle-stock"
import { BundleWeigth } from "src/bundle/domain/value-object/bundle-weigth"
import { IIdGen } from "src/common/application/id-gen/id-gen.interface"
import { IMapper } from "src/common/application/mappers/mapper.interface"
import { OrmBundleEntity } from "../../entities/orm-entities/orm-bundle-entity"
import { OrmBundleImage } from "src/Bundle/infraestructure/entities/orm-entities/orm-Bundle-image"
import { ProductID } from "src/product/domain/value-object/product-id"
import { OrmProductEntity } from "src/product/infraestructure/entities/orm-entities/orm-product-entity"
import { DataSource, Repository } from "typeorm"
import { NotFoundException } from "@nestjs/common"


export class OrmBundleMapper implements IMapper <Bundle,OrmBundleEntity>{

    private readonly ormProductRepository:Repository<OrmProductEntity>
    constructor(
        dataSource:DataSource,
        private readonly idGen:IIdGen<string>
    ){
        this.ormProductRepository=dataSource.getRepository(OrmProductEntity)
    }

    async fromDomaintoPersistence(domainEntity: Bundle): Promise<OrmBundleEntity> {
        let ormImages:OrmBundleImage[]=[]
        for (const image of domainEntity.BundleImages){
            ormImages.push(
                OrmBundleImage.create(await this.idGen.genId(),image.Value,domainEntity.getId().Value)
            )
        }

        let products:OrmProductEntity[]=[]

        for (const id of domainEntity.ProductId){
            let product=await this.ormProductRepository.findOneBy({id:id.Value})
            if(!product)
                throw new NotFoundException('Find product id not registered')
            products.push(product)
        }

        let data:OrmBundleEntity={
            id:domainEntity.getId().Value,
            name: domainEntity.BundleName.Value,
            desciption: domainEntity.BundleDescription.Value,
            caducityDate: domainEntity.BundleCaducityDate.Value,
            stock: domainEntity.BundleStock.Value,
            images: ormImages,
            price:domainEntity.BundlePrice.Price,
            currency:domainEntity.BundlePrice.Currency,
            weigth:domainEntity.BundleWeigth.Weigth,
            measurament:domainEntity.BundleWeigth.Measure,
            products
        }
        return data
    }
    async fromPersistencetoDomain(infraEstructure: OrmBundleEntity): Promise<Bundle> {

        let bundle=Bundle.initializeAggregate(
            BundleId.create(infraEstructure.id),
            BundleDescription.create(infraEstructure.desciption),
            BundleCaducityDate.create(infraEstructure.caducityDate),
            BundleName.create(infraEstructure.name),
            BundleStock.create(infraEstructure.stock),
            infraEstructure.images.map((ormimage)=>BundleImage.create(ormimage.image)),
            BundlePrice.create(infraEstructure.price,infraEstructure.currency),
            BundleWeigth.create(infraEstructure.weigth,infraEstructure.measurament),
            infraEstructure.products.map(product=>ProductID.create(product.id))
        )
        return bundle
    }
}