import { IServiceRequestDto } from "src/common/application/services"

export interface AddUserDirectionsApplicationRequestDTO extends IServiceRequestDto{
    directions:{
        name: string;
        direction: string;
        favorite: boolean;
        lat: number;
        long: number;
    }
}