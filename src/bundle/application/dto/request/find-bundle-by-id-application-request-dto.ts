import { IServiceRequestDto } from "src/common/application/services"

export interface FindBundleByIdApplicationRequestDTO extends IServiceRequestDto {
    id:string
}