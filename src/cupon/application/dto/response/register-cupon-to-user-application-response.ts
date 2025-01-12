import { IServiceResponseDto } from "src/common/application/services";

export interface RegisterCuponToUserApplicationResponseDTO extends IServiceResponseDto {
    cuponId: string;
    userIds: string[];
    state: string;
}