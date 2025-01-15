// import { Result } from 'src/common/utils/result-handler/result';
// import { ISycnchronizeService } from 'src/common/infraestructure/synchronize-service/synchronize.service.interface';
// import { Model, Mongoose } from 'mongoose';
// import { BundleDeletedInfraestructureRequestDTO } from '../dto/request/category-deleted-infraestructure-request-dto';
// import { OdmBundle, OdmBundleSchema } from '../../entities/odm-entities/odm-bundle-entity';

// export class BundleDeletedSyncroniceService 
// implements ISycnchronizeService<BundleDeletedInfraestructureRequestDTO,void>{
    
//     private readonly model: Model<OdmBundle>

//     constructor( mongoose: Mongoose ) { 
//         this.model = mongoose.model<OdmBundle>('OdmBundle', OdmBundleSchema)
//     }
//     async execute(event: BundleDeletedInfraestructureRequestDTO): Promise<Result<void>> {
//         await this.model.deleteOne({id:event.bundleId})
//         return Result.success(undefined)
//     }   
// }