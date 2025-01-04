import { IServiceRequestDto } from "src/common/application/services";

export interface FindCategoryByBundleIdApplicationRequestDTO extends IServiceRequestDto {
    id: string;
    
}
