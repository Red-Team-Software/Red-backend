import { IServiceResponseDto } from "src/common/application/services";

export interface DeleteCategoryApplicationResponseDTO extends IServiceResponseDto {
    id: string; // Mensaje de confirmación
}