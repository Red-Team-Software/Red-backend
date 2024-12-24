import { IServiceResponseDto } from "src/common/application/services"

export class FindUserDirectionsByIdApplicationRequestDTO implements IServiceResponseDto{
    id:string
    name: string
    favorite: boolean
    lat: number
    lng: number
    address:string
}