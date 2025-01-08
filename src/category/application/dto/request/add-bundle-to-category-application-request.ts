import { IServiceRequestDto } from "src/common/application/services";

export interface AddBundleToCategoryApplicationRequestDTO extends IServiceRequestDto {
    categoryId:string,
    bundleId:string
}