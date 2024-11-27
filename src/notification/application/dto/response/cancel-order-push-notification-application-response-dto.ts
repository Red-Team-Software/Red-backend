import { IServiceRequestDto, IServiceResponseDto } from "src/common/application/services"

export interface CancelOrderPushNotificationApplicationResponseDTO extends IServiceResponseDto {
    succses:boolean
}