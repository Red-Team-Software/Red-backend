import { IServiceResponseDto } from "src/common/application/services";

export interface FindCategoryByBundleIdApplicationResponseDTO extends IServiceResponseDto {
    id: string;
    name: string;
    image: string;
    bundles: string[];
}
