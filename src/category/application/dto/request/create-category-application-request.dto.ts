import { IServiceRequestDto } from "src/common/application/services";

export interface CreateCategoryApplicationRequestDTO extends IServiceRequestDto {
    name: string;
    image: Buffer;
    products: string[];
    bundles:string[]
}