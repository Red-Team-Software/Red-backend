import { IServiceResponseDto } from 'src/common/application/services'

export interface LogInUserApplicationResponseDTO extends IServiceResponseDto {
    
    user: {
        id: string,
        email: string,
        name: string,
        phone: string
    }
    type: string
    token: string
  
}