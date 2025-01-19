import { IServiceRequestDto } from "src/common/application/services";

export interface RegisterCuponToUserApplicationRequestDTO extends IServiceRequestDto{
    cuponId: string;
    userIds: string[];
}