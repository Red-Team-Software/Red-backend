import { UpdateBundleApplicationRequestDTO } from './../../dto/request/update-bundle-application-request-dto';
import { Bundle } from "src/bundle/domain/aggregate/bundle.aggregate"
import { BundleCaducityDate } from "src/bundle/domain/value-object/bundle-caducity-date"
import { BundleDescription } from "src/bundle/domain/value-object/bundle-description"
import { BundleId } from "src/bundle/domain/value-object/bundle-id"
import { BundleName } from "src/bundle/domain/value-object/bundle-name"
import { BundlePrice } from "src/bundle/domain/value-object/bundle-price"
import { BundleStock } from "src/bundle/domain/value-object/bundle-stock"
import { BundleWeigth } from "src/bundle/domain/value-object/bundle-weigth"
import { ErrorUploadingImagesApplicationException } from "../../application-exception/error-uploading-images-application-exception"
import { FileUploaderResponseDTO } from "src/common/application/file-uploader/dto/response/file-uploader-response-dto"
import { IApplicationService } from "src/common/application/services"
import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract"
import { IFileUploader } from "src/common/application/file-uploader/file-uploader.interface"
import { IIdGen } from "src/common/application/id-gen/id-gen.interface"
import { ProductID } from "src/product/domain/value-object/product-id"
import { Result } from "src/common/utils/result-handler/result"
import { TypeFile } from "src/common/application/file-uploader/enums/type-file.enum"
import { IQueryBundleRepository } from "../../query-repository/query-bundle-repository"
import { ICommandBundleRepository } from "src/bundle/domain/repository/bundle.command.repository.interface"
import { ErrorBundleNameAlreadyApplicationException } from "../../application-exception/error-bundle-name-already-exist-application-exception"
import { IQueryProductRepository } from "src/product/application/query-repository/query-product-repository"
import { UpdateBundleApplicationResponseDTO } from '../../dto/response/update-bundle-application-response-dto';
import { NotFoundBundleApplicationException } from '../../application-exception/not-found-bundle-application-exception';
import { Product } from 'src/product/domain/aggregate/product.aggregate';
import { ErrorUpdatingBundleApplicationException } from '../../application-exception/error-updating-bundle-application-exception';
import { BundleImage } from 'src/bundle/domain/value-object/bundle-image';

export class UpdateBundleApplicationService extends IApplicationService 
<UpdateBundleApplicationRequestDTO,UpdateBundleApplicationResponseDTO> {

    constructor(
        private readonly eventPublisher: IEventPublisher,
        private readonly bundleQueryRepository:IQueryBundleRepository,
        private readonly bundleCommadRepository:ICommandBundleRepository,
        private readonly productQueryRepository:IQueryProductRepository,
        private readonly idGen:IIdGen<string>,
        private readonly fileUploader:IFileUploader
    ){
        super()
    }
    async execute(command: UpdateBundleApplicationRequestDTO): Promise<Result<UpdateBundleApplicationResponseDTO>> {

        let search= await this.bundleQueryRepository.findBundleById(
            BundleId.create(command.bundleId)
        )

        if(!search.isSuccess())
            return Result.fail(new NotFoundBundleApplicationException())

        const bundle=search.getValue

        if(command.description)
            bundle.updateDescription(BundleDescription.create(command.description))

        if(command.caducityDate)
            bundle.updateCaducityDate(BundleCaducityDate.create(command.caducityDate))

        if(command.stock)
            bundle.updateStock(BundleStock.create(command.stock))

        if(command.price && !command.currency)
            bundle.updatePrice(BundlePrice.create(
                command.price,
                bundle.BundlePrice.Currency
            )
        )

        if(!command.price && command.currency)
            bundle.updatePrice(BundlePrice.create(
                bundle.BundlePrice.Price,
                command.currency
            )
        )

        if(command.price && command.currency)
            bundle.updatePrice(BundlePrice.create(
                command.price,
                command.currency
            )
        )

        if(command.weigth && !command.measurement)
            bundle.updateWeigth(BundleWeigth.create(
                command.weigth,
                bundle.BundleWeigth.Measure
            )
        )

        if(!command.weigth && command.measurement)
            bundle.updateWeigth(BundleWeigth.create(
                bundle.BundleWeigth.Weigth,
                command.measurement
            )
        )

        if(command.weigth && command.measurement)
            bundle.updateWeigth(BundleWeigth.create(
                command.weigth,
                command.measurement
            )
        )

        if (command.name){

            let search=await this.bundleQueryRepository.verifyBundleExistenceByName(
                BundleName.create(command.name)
            )
    
            if (!search.isSuccess())
                return Result.fail(new ErrorUpdatingBundleApplicationException())
    
            if (search.getValue) 
                return Result.fail(new ErrorBundleNameAlreadyApplicationException(command.name))

            bundle.updateName(BundleName.create(command.name))
        }
        
        if (command.productId){
            let products:Product[]=[]
            for (const product of command.productId){
                
                let productResponse=await this.productQueryRepository.findProductById(
                    ProductID.create(product)
                )
                
                if (!productResponse.isSuccess())
                    return Result.fail(productResponse.getError)

                products.push(productResponse.getValue)
            }
            bundle.updateProducts(products.map(p=>p.getId()))
        }

        if (command.images){

            let uploaded:FileUploaderResponseDTO[]=[]

            for (const image of bundle.BundleImages){
                let imageDelted=await this.fileUploader.deleteFile(image.Value)
                if (!imageDelted.isSuccess())
                    return Result.fail(imageDelted.getError)
            }

            for (const image of command.images){
                let idImage=await this.idGen.genId()
                let imageuploaded=await this.fileUploader.uploadFile(image,TypeFile.image,idImage)
                
                if(!imageuploaded.isSuccess())
                    return Result.fail(new ErrorUploadingImagesApplicationException())
        
                uploaded.push(imageuploaded.getValue)
            }

            bundle.updateImages(uploaded.map(i=>BundleImage.create(i.url)))
        
        }

        let result=await this.bundleCommadRepository.updateBundle(bundle)

        if (!result.isSuccess()) 
            return Result.fail(new ErrorUpdatingBundleApplicationException())
    
        await this.eventPublisher.publish(bundle.pullDomainEvents())

        return Result.success({
            bundleId:bundle.getId().Value,
            name: bundle.BundleName.Value,
            description: bundle.BundleDescription.Value,
            caducityDate: bundle.BundleCaducityDate
            ? bundle.BundleCaducityDate.Value
            : null,
            stock: bundle.BundleStock.Value,
            images: bundle.BundleImages.map(i=>i.Value),
            price:bundle.BundlePrice.Price,
            currency:bundle.BundlePrice.Currency,
            weigth:bundle.BundleWeigth.Weigth,
            measurement:bundle.BundleWeigth.Measure,
            productId:bundle.ProductId.map(p=>p.Value)
        })
    }

}