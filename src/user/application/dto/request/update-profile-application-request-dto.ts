import { IServiceRequestDto } from "src/common/application/services"

export interface UpdateProfileApplicationRequestDTO extends IServiceRequestDto{
    email?: string
    name?: string
    password?: string
    phone?: string
    image?: string
}