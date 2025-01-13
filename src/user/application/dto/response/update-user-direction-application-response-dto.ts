import { IServiceResponseDto } from "src/common/application/services"

export interface UpdateUserDirectionsApplicationResponseDTO extends IServiceResponseDto{
    id:string
    name: string;
    direction: string;
    favorite: boolean;
    lat: number;
    long: number; 
}