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


export class OrmbBundleMapper implements IMapper <Bundle,OrmBundleEntity>{

    constructor(
        private readonly idGen:IIdGen<string>
    ){}

    async fromDomaintoPersistence(domainEntity: Bundle): Promise<OrmBundleEntity> {
        let ormImages:OrmBundleImage[]=[]
        for (const image of domainEntity.BundleImages){
            ormImages.push(
                OrmBundleImage.create(await this.idGen.genId(),image.Value,domainEntity.getId().Value)
            )
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
            measurament:domainEntity.BundleWeigth.Measure
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
            infraEstructure.images.map(product=>ProductID.create(product.id))
        )
        //TODO Hacerlo con blog y unirlo en un many to many
        return bundle
    }
}