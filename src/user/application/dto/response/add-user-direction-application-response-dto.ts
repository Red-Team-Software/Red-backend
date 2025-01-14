import { IServiceResponseDto } from "src/common/application/services"

export interface AddUserDirectionApplicationResponseDTO extends IServiceResponseDto{
    id:string
    name: string;
    direction: string;
    favorite: boolean;
    lat: number;
    long: number;   
}