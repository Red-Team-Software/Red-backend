import { IServiceRequestDto } from "src/common/application/services";

export interface ForgetPasswordApplicationRequestDTO extends IServiceRequestDto {
    email: string
}