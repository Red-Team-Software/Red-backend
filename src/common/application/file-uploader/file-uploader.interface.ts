import { Result } from "src/common/utils/result-handler/result";
import { TypeFile } from "./enums/type-file.enum";
import { FileUploaderResponseDTO } from "./dto/response/file-uploader-response-dto";

export interface IFileUploader {
    uploadFile(buffer:Buffer, typeFile: TypeFile, id:string): Promise<Result<FileUploaderResponseDTO>>
}
