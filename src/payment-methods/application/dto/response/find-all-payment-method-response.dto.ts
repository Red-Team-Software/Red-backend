import { IServiceResponseDto } from "src/common/application/services/dto/response/service-response-dto.interface";

export interface FindAllPaymentMethodResponseDTO extends IServiceResponseDto {
    id:string,
    name:string,
    state:string,
    imageUrl:string
}