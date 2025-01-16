import { IServiceRequestDto } from "src/common/application/services";

export interface UseCuponApplicationRequestDTO extends IServiceRequestDto {
    userId: string,
    cuponId: string
}
