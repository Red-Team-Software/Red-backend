import { IApplicationService } from "src/common/application/services/application.service.interface";
import { Result } from "src/common/utils/result-handler/result";
import { CreateProductApplicationRequestDTO } from "../dto/request/create-product-application-request-dto";
import { CreateProductApplicationResponseDTO } from "../dto/response/create-product-application-response-dto";
import { IProductRepository } from "src/product/domain/repository/product.interface.repositry";
import { IIdGen } from "src/common/application/id-gen/id-gen.interface";
import { Product } from "src/product/domain/aggregate/product.aggregate";
import { ProductID } from "src/product/domain/value-object/product-id";
import { ProductDescription } from "src/product/domain/value-object/product-description";
import { ProductCaducityDate } from "src/product/domain/value-object/product-caducity-date";
import { ProductName } from "src/product/domain/value-object/product-name";
import { ProductStock } from "src/product/domain/value-object/product-stock";
import { ProductImage } from "src/product/domain/value-object/product-image";
import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract";

export class CreateProductApplicationService extends IApplicationService 
<CreateProductApplicationRequestDTO,CreateProductApplicationResponseDTO> {

    constructor(
        private readonly eventPublisher: IEventPublisher,
        private readonly productRepository:IProductRepository,
        private readonly idGen:IIdGen<string>
    ){
        super()
    }
    async execute(command: CreateProductApplicationRequestDTO): Promise<Result<CreateProductApplicationResponseDTO>> {
        let product=Product.RegisterProduct(
            ProductID.create(await this.idGen.genId()),
            ProductDescription.create(command.desciption),
            ProductCaducityDate.create(command.caducityDate),
            ProductName.create(command.name),
            ProductStock.create(command.stock),
            command.images.map((image)=>ProductImage.create(image))
        )
        let result=await this.productRepository.createProduct(product)
        if (!result.isSuccess()) 
            return Result.fail(new Error('Error during creation of product'))
        this.eventPublisher.publish(product.pullDomainEvents())
        
        return Result.success(command)
    }

}