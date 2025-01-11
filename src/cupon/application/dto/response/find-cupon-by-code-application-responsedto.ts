import { IServiceResponseDto } from "src/common/application/services";

export interface FindCuponByCodeApplicationResponseDTO extends IServiceResponseDto {
    cuponUserId:string;
    discount: number;
    state: string;
}
