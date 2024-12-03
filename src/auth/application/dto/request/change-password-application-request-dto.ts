import { IServiceRequestDto } from "src/common/application/services"

export interface ChangePasswordApplicationRequestDTO extends IServiceRequestDto {
    
    email: string
    password: string
    code: string

}