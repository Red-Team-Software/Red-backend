import { IServiceRequestDto } from "src/common/application/services";

export interface UpdateCategoryApplicationRequestDTO extends IServiceRequestDto {
    id: string; // ID de la categoría a actualizar
    name: string; // Nuevo nombre de la categoría
    image: Buffer;
}
