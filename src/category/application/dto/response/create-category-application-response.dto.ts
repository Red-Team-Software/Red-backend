import { IServiceResponseDto } from "src/common/application/services";

export interface CreateCategoryApplicationResponseDTO extends IServiceResponseDto {
    id: string;
    name: string;
    image: string;
}