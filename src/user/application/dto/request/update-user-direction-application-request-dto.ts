import { IServiceRequestDto } from "src/common/application/services"

export interface UpdateUserDirectionsApplicationRequestDTO extends IServiceRequestDto{
    directions:{
        id:string
        name: string
        favorite: boolean
        lat: number
        long: number
    }
}