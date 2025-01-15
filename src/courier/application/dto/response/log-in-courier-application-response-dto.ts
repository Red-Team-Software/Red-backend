import { IServiceResponseDto } from 'src/common/application/services'

export interface LogInCourierApplicationResponseDTO extends IServiceResponseDto {
    
    id: string,
    email: string,
    name: string
    
    token: string

}