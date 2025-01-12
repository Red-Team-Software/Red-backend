import { IServiceResponseDto } from "src/common/application/services";

export interface FindCuponByCodeApplicationResponseDTO extends IServiceResponseDto {
    cuponId: string;
    cuponUserId: string;
    discount: number;
    state: string;
}
