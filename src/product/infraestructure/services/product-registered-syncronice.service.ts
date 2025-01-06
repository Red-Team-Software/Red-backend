import { ISynchronizeService  } from 'src/common/infraestructure/synchronize-service/synchronize.service.interface';
import { Result } from 'src/common/utils/result-handler/result';
import { ProductRegistered } from "src/product/domain/domain-events/product-registered";
import { ICommandProductRepository } from "src/product/domain/repository/product.command.repositry.interface";

export class ProductRegisteredSyncroniceService implements ISynchronizeService<ProductRegistered>{
    constructor(
        private readonly commandProductRepository:ICommandProductRepository,
    ){}
    execute(event: ProductRegistered): Promise<Result<void>> {
        throw new Error('Method not implemented.');
    }
    
}