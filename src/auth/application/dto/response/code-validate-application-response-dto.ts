import { IServiceResponseDto } from 'src/common/application/services'

export interface CodeValidateApplicationResponseDTO extends IServiceResponseDto {
    
    code: string
    validate: boolean
  
}