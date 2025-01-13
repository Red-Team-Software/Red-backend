import { IServiceResponseDto } from "src/common/application/services";

export interface RegisterUserApplicationResponseDTO extends IServiceResponseDto  {
    id: string   
    token:string
}