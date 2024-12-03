import { IServiceRequestDto } from "src/common/application/services"

export interface DeleteUserDirectionsApplicationRequestDTO extends IServiceRequestDto{
    directions:{
        name: string
        favorite: boolean
        lat: number
        lng: number
    }[]
}