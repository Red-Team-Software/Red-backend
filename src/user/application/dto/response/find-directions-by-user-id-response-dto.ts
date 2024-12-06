import { IServiceResponseDto } from "src/common/application/services"

export class FindUserDirectionsByIdApplicationRequestDTO implements IServiceResponseDto{
    lat: number
    lng: number
    adress: string
}