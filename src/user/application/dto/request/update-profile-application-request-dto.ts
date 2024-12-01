import { IServiceRequestDto } from "src/common/application/services"

export interface UpdateProfileApplicationRequestDTO extends IServiceRequestDto{
    accountId:string
    email?: string
    name?: string
    password?: string
    phone?: string
    image?: Buffer
}