import { IServiceRequestDto } from "src/common/application/services"

export interface DeleteUserDirectionsApplicationRequestDTO extends IServiceRequestDto{
    directions:{
        id:string
    }[]
}