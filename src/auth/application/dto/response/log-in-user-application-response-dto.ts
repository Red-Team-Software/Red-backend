import { IServiceResponseDto } from 'src/common/application/services'

export interface LogInUserApplicationResponseDTO extends IServiceResponseDto {

    accountId:string
    
    user: {
        id: string,
        email: string,
        name: string,
        phone: string
    }
    type: string
    token: string
  
}