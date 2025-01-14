import { IServiceResponseDto } from "src/common/application/services";

export interface FindAllCategoriesApplicationResponseDTO extends IServiceResponseDto {
    id: string;
    name: string;
    image: string;
    products:{
        id:string
    }[]
}

