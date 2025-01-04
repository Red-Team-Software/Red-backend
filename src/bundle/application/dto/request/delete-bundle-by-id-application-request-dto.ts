import { IServiceRequestDto } from "src/common/application/services"

export interface DeleteBundlebyIdApplicationRequestDTO extends IServiceRequestDto {
    id:string
}