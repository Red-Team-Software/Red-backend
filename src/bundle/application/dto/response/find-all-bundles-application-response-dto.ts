import { IServiceResponseDto } from "src/common/application/services";

export interface FindAllBundlesApplicationResponseDTO extends IServiceResponseDto {
    bundleId:string,
    bundleDescription:string,
    bundleName:string,
    bundleImages:string[],
    bundlePrice:number,
    bundleCurrency:string
}