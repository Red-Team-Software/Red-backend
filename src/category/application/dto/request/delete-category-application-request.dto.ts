import { IServiceRequestDto } from "src/common/application/services";

export interface DeleteCategoryApplicationRequestDTO extends IServiceRequestDto {
    id: string; // ID de la categoría a eliminar
}
