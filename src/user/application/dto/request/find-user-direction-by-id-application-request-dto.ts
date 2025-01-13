import { IServiceRequestDto } from "src/common/application/services"

export class FindUserDirectionByIdApplicationRequestDTO implements IServiceRequestDto{
    userId: string;
    id: string;
}