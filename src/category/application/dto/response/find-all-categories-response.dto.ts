import { IServiceResponseDto } from "src/common/application/services";

export interface FindAllCategoriesApplicationResponseDTO extends IServiceResponseDto {
    categoryId: string;
    categoryName: string;
    categoryImage: string;
    products:{
        id:string
    }[]
}

