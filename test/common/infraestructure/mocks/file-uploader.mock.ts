import { FileUploaderResponseDTO } from "src/common/application/file-uploader/dto/response/file-uploader-response-dto";
import { TypeFile } from "src/common/application/file-uploader/enums/type-file.enum";
import { IFileUploader } from "src/common/application/file-uploader/file-uploader.interface";
import { Result } from "src/common/utils/result-handler/result";

export class FileUploaderMock implements IFileUploader {

    async uploadFile(buffer: Buffer, fileType: TypeFile, id:string): Promise<Result<FileUploaderResponseDTO>> {

        let response:FileUploaderResponseDTO={
            url:`http://${buffer.toString()}.com`,
            publicId:id
        }
        return Result.success(response);
    }
}
