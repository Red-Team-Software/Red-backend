import { Result } from 'src/common/utils/result-handler/result';
import { ISycnchronizeService } from 'src/common/infraestructure/synchronize-service/synchronize.service.interface';
import { OdmProduct, OdmProductSchema } from '../../entities/odm-entities/odm-product-entity';
import { Model, Mongoose } from 'mongoose';
import { ProductDeletedInfraestructureRequestDTO } from '../dto/request/product-deleted-infraestructure-request-dto';

export class ProductDeletedSyncroniceService 
implements ISycnchronizeService<ProductDeletedInfraestructureRequestDTO,void>{
    
    private readonly model: Model<OdmProduct>

    constructor( mongoose: Mongoose ) { 
        this.model = mongoose.model<OdmProduct>('OdmProduct', OdmProductSchema)
    }
    async execute(event: ProductDeletedInfraestructureRequestDTO): Promise<Result<void>> {
        await this.model.deleteOne({id:event.productId})
        return Result.success(undefined)
    }   
}