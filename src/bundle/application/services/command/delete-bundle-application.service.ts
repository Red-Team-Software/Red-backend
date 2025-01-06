import { IApplicationService } from "src/common/application/services/application.service.interface";
import { Result } from "src/common/utils/result-handler/result";
import { DeleteBundlebyIdApplicationResponseDTO } from "../../dto/response/delete-bundle-by-id-application-response-dto";
import { DeleteBundlebyIdApplicationRequestDTO } from "../../dto/request/delete-bundle-by-id-application-request-dto";
import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract";
import { IFileUploader } from "src/common/application/file-uploader/file-uploader.interface";
import { ICommandBundleRepository } from "src/bundle/domain/repository/bundle.command.repository.interface";
import { IQueryBundleRepository } from "../../query-repository/query-bundle-repository";
import { BundleId } from "src/bundle/domain/value-object/bundle-id";
import { ErrorDeletingBundleImagesApplicationException } from "../../application-exception/error-deleting-bundle-images-application-exception";

export class DeleteBundleApplicationService extends IApplicationService <
    DeleteBundlebyIdApplicationRequestDTO,
    DeleteBundlebyIdApplicationResponseDTO
> {
    constructor(
        private readonly eventPublisher: IEventPublisher,
        private readonly commandBundleRepository:ICommandBundleRepository,
        private readonly queryBundleRepository:IQueryBundleRepository,
        private readonly fileUploader:IFileUploader
    ){
        super()
    }
    async execute(command: DeleteBundlebyIdApplicationRequestDTO): Promise<Result<DeleteBundlebyIdApplicationResponseDTO>> {

        let search=await this.queryBundleRepository.findBundleById(
            BundleId.create(command.id)
        )

        if (!search.isSuccess())
            return Result.fail(search.getError)

        const bundle=search.getValue

        bundle.delete()

        for(const image of bundle.BundleImages){
            
            let fileResponse=await this.fileUploader.deleteFile(image.Value)

            if (!fileResponse.isSuccess())
                return Result.fail(new ErrorDeletingBundleImagesApplicationException())
        }

        let productDeleteResponse=await this.commandBundleRepository.deleteBundleById(bundle.getId())

        if (!productDeleteResponse.isSuccess())
            return Result.fail(productDeleteResponse.getError)

        await this.eventPublisher.publish(bundle.pullDomainEvents())

        return Result.success({...command})
    }

}