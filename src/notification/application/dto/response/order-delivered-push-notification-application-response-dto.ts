import { IServiceRequestDto, IServiceResponseDto } from "src/common/application/services"

export interface OrderDeliveredPushNotificationApplicationResponseDTO extends IServiceResponseDto {
    succses:boolean
}