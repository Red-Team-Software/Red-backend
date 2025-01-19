import { IServiceRequestDto } from "src/common/application/services";

export interface AddBundleToCategoryApplicationResponseDTO extends IServiceRequestDto {
    categoryId:string,
    bundleId:string
}