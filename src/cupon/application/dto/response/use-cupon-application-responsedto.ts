import { IServiceResponseDto } from "src/common/application/services";

export interface UseCuponApplicationResponseDTO extends IServiceResponseDto {
    userId:string;
    cuponId: string; // Código único del cupón
    status: string;
}