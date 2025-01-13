import { IServiceResponseDto } from "src/common/application/services"

export class FindUserDirectionsByIdApplicationResponseDTO implements IServiceResponseDto{
    id:string
    name: string
    favorite: boolean
    lat: number
    long: number
    address:string
}