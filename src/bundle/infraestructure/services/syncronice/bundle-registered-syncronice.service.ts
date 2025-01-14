import { Result } from 'src/common/utils/result-handler/result';
import { ISycnchronizeService } from 'src/common/infraestructure/synchronize-service/synchronize.service.interface';
import { BundleRegistredInfraestructureRequestDTO } from '../dto/request/bundle-registered-infraestructure-request-dto';
import { Model, Mongoose } from 'mongoose';
import { OdmBundle, OdmBundleSchema } from '../../entities/odm-entities/odm-bundle-entity';
import { OdmProduct, OdmProductSchema } from 'src/product/infraestructure/entities/odm-entities/odm-product-entity';

export class BundleRegisteredSyncroniceService implements ISycnchronizeService<BundleRegistredInfraestructureRequestDTO,void>{

    private readonly model: Model<OdmBundle>
    private readonly productmodel: Model<OdmProduct>


    constructor( mongoose: Mongoose ) { 
        this.model = mongoose.model<OdmBundle>('OdmBundle', OdmBundleSchema)
        this.productmodel = mongoose.model<OdmProduct>('OdmProduct', OdmProductSchema)
    }
    
    async execute(event: BundleRegistredInfraestructureRequestDTO): Promise<Result<void>> {

        const odmProducts: OdmProduct[] = [];
        for (const productId of event.bundleProductId) {
          let odmProduct = await this.productmodel.findOne({ id: productId });
          if (odmProduct) {
            odmProducts.push(odmProduct);
          }
        }

        const bundle = new this.model({
            id: event.bundleId,
            name: event.bundleName,
            description: event.bundleDescription,
            image: event.bundleImages,
            caducityDate: event.bundleCaducityDate ,
            stock: event.bundleStock,
            price: event.bundlePrice.price,
            currency: event.bundlePrice.currency,
            weigth: event.bundleWeigth.weigth,
            measurament: event.bundleWeigth.measure,
            products:odmProducts
            ? odmProducts.map(p=>({
              id:p.id,
              name:p.name
            }))
            : [],
            category:[] 
        })
        await this.model.create(bundle)
        return Result.success(undefined)
    }   
}