import { IServiceResponseDto } from "src/common/application/services";

export interface FindAllCuponsApplicationResponseDTO extends IServiceResponseDto {
   
    id:string;
    code: string; 
    name: string;
    discount: number;
    state: string;
    
}
