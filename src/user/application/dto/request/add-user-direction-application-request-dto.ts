import { IServiceRequestDto } from "src/common/application/services"

export interface AddUserDirectionsApplicationRequestDTO extends IServiceRequestDto{
    directions:{
        name: string
        favorite: boolean
        lat: number
        lng: number
    }[]
}