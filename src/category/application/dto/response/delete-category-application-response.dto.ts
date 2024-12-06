import { IServiceResponseDto } from "src/common/application/services";

export interface DeleteCategoryApplicationResponseDTO extends IServiceResponseDto {
    message: string; // Mensaje de confirmación
}