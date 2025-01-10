import { FileUploaderResponseDTO } from './../../application/file-uploader/dto/response/file-uploader-response-dto';
import { TypeFile } from "src/common/application/file-uploader/enums/type-file.enum";
import { IFileUploader } from "src/common/application/file-uploader/file-uploader.interface";
import { Result } from "src/common/utils/result-handler/result";
import { CloudinaryResponse } from "./types/cloudinary-response.type";
import { v2 as cloudinary } from "cloudinary";
import { createReadStream } from "streamifier";

export class CloudinaryService implements IFileUploader {

    private extractPublicIdFromUrl(url: string): string {
        const regex = /\/v\d+\/([^/]+)\.[a-z]+$/;
        const match = url.match(regex);
        if (match && match[1]) {
            return match[1];
        }
        throw new Error('Invalid Cloudinary URL');
    }

    async deleteFile(file: string): Promise<Result<boolean>> {
        try {
            let response=await cloudinary.uploader.destroy(this.extractPublicIdFromUrl(file));
            return Result.success(true);
        } catch (error) {
            return Result.fail(error);
        }
    }

    async uploadFile(buffer: Buffer, fileType: TypeFile, id:string): Promise<Result<FileUploaderResponseDTO>> {

        const result = await new Promise<CloudinaryResponse>(
            (resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: fileType,
                        public_id:id
                    },
                    (err, result) => {
                        if (err) return reject(err);
                        resolve(result);
                    }
                );
                createReadStream(buffer).pipe(uploadStream);
        })
        let response:FileUploaderResponseDTO={
            url:result.url,
            publicId:result.public_id
        }
        return Result.success(response);
    }
}
