import { Result } from 'src/common/utils/result-handler/result';
import { ISycnchronizeService } from 'src/common/infraestructure/synchronize-service/synchronize.service.interface';
import { ProductUpdatedInfraestructureRequestDTO } from '../dto/request/product-updated-infraestructure-request-dto';
import { OdmProduct, OdmProductSchema } from '../../entities/odm-entities/odm-product-entity';
import { Model, Mongoose } from 'mongoose';

export class ProductUpdatedSyncroniceService 
implements ISycnchronizeService<ProductUpdatedInfraestructureRequestDTO,void>{
    
    private readonly model: Model<OdmProduct>

    constructor( mongoose: Mongoose ) { 
        this.model = mongoose.model<OdmProduct>('OdmProduct', OdmProductSchema)
    }
    async execute(event: ProductUpdatedInfraestructureRequestDTO): Promise<Result<void>> {
        let product= await this.model.findOne({id:event.productId})
        if (event.productCaducityDate)
            product.caducityDate=event.productCaducityDate
        if (event.productDescription)
            product.description=event.productDescription
        if (event.productImages){
            product.image=event.productImages
        }
        if (event.productName)
            product.name=event.productName
        if (event.productPrice){
            product.price=event.productPrice.price
            product.currency=event.productPrice.currency
        }
        if (event.productStock)
            product.stock=event.productStock
        if (event.productWeigth){
            product.weigth=event.productWeigth.weigth
            product.measurament=event.productWeigth.measure
        }
        await this.model.updateOne({id:product.id},product)
        return Result.success(undefined)
    }   
}