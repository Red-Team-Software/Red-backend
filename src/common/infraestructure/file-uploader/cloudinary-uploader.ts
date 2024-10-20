// import { v2 as cloudinary } from "cloudinary";
// import { IFileUploader } from "src/common/application/file-uploader/file-uploader.interface";
// import { Result } from "src/common/domain/result-handler/result";
// import { createReadStream } from "streamifier";
// import { CloudinaryResponse } from "./types/cloudinary-response.type";
// import { TypeFile } from "src/common/application/file-uploader/enums/type-file.enum";

// export class CloudinaryService implements IFileUploader {

//     async uploadFile(file: Express.Multer.File, fileType: TypeFile): Promise<Result<string>> {
//         const result = await new Promise<CloudinaryResponse>(
//             (resolve, reject) => {
//                 const uploadStream = cloudinary.uploader.upload_stream(
//                     {
//                         resource_type: fileType
//                     },
//                     (err, result) => {
//                         if (err) return reject(err);
//                         resolve(result);
//                     }
//                 );
//                 createReadStream(file.buffer).pipe(uploadStream);
//         })

//         return Result.success(result.url);
//     }
// }
