import { Bundle } from "src/bundle/domain/aggregate/bundle.aggregate"
import { BundleCaducityDate } from "src/bundle/domain/value-object/bundle-caducity-date"
import { BundleDescription } from "src/bundle/domain/value-object/bundle-description"
import { BundleId } from "src/bundle/domain/value-object/bundle-id"
import { BundleImage } from "src/bundle/domain/value-object/bundle-image"
import { BundleName } from "src/bundle/domain/value-object/bundle-name"
import { BundlePrice } from "src/bundle/domain/value-object/bundle-price"
import { BundleStock } from "src/bundle/domain/value-object/bundle-stock"
import { BundleWeigth } from "src/bundle/domain/value-object/bundle-weigth"
import { IMapper } from "src/common/application/mappers/mapper.interface"
import { ProductID } from "src/product/domain/value-object/product-id"
import { IOdmBundle } from "../../model-entity/odm-model-entity/odm-bundle-interface"


export class OdmBundleMapper implements IMapper <Bundle,IOdmBundle>{

    constructor(){}

    async fromDomaintoPersistence(domainEntity: Bundle): Promise<IOdmBundle> {
     return {
          id: domainEntity.getId().Value,
          name: domainEntity.BundleName.Value,
          description: domainEntity.BundleDescription.Value,
          image: domainEntity.BundleImages.map(i=>i.Value),
          caducityDate: domainEntity.BundleCaducityDate
          ? domainEntity.BundleCaducityDate.Value
          : null,
          stock: domainEntity.BundleStock.Value,
          price: domainEntity.BundlePrice.Price,
          currency: domainEntity.BundlePrice.Currency,
          weigth: domainEntity.BundleWeigth.Weigth,
          measurament: domainEntity.BundleWeigth.Measure,
          category: [],
          products: []
     }
    }
    async fromPersistencetoDomain(infraEstructure: IOdmBundle): Promise<Bundle> {

        let bundle=Bundle.initializeAggregate(
            BundleId.create(infraEstructure.id),
            BundleDescription.create(infraEstructure.description),
            BundleName.create(infraEstructure.name),
            BundleStock.create(infraEstructure.stock),
            infraEstructure.image.map((ormimage)=>BundleImage.create(ormimage)),
            BundlePrice.create(Number(infraEstructure.price),infraEstructure.currency),
            BundleWeigth.create(infraEstructure.weigth,infraEstructure.measurament),
            infraEstructure.products.map(product=>ProductID.create(product.id)),
            BundleCaducityDate.create(infraEstructure.caducityDate),
        )
        return bundle
    }
}