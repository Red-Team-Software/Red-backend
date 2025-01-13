import { IServiceRequestDto } from "src/common/application/services"

export class FindUserDirectionsByIdApplicationRequestDTO implements IServiceRequestDto{
    userId: string;
}