import { Result } from 'src/common/utils/result-handler/result';
import { ISycnchronizeService } from 'src/common/infraestructure/synchronize-service/synchronize.service.interface';
import { ProductRegistredInfraestructureRequestDTO } from '../dto/request/product-registered-infraestructure-request-dto';
import { Model, Mongoose } from 'mongoose';
import { OdmProduct, OdmProductSchema } from '../../entities/odm-entities/odm-product-entity';

export class ProductRegisteredSyncroniceService implements ISycnchronizeService<ProductRegistredInfraestructureRequestDTO,void>{

    private readonly model: Model<OdmProduct>

    constructor( mongoose: Mongoose ) { 
        this.model = mongoose.model<OdmProduct>('OdmProduct', OdmProductSchema)
    }
    
    async execute(event: ProductRegistredInfraestructureRequestDTO): Promise<Result<void>> {
        const product = new this.model({
            id: event.productId,
            name: event.productName,
            description: event.productDescription,
            image: event.productImage,
            caducityDate: event.productCaducityDate ,
            stock: event.productStock,
            price: event.productPrice.price,
            currency: event.productPrice.currency,
            weigth: event.productWeigth.weigth,
            measurament: event.productWeigth.weigth,
            category:[] 
        })
        await this.model.create(product)
        return Result.success(undefined)
    }   
}