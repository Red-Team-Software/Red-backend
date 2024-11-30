import { IServiceRequestDto } from 'src/common/application/services';

export interface CodeValidateApplicationRequestDTO extends IServiceRequestDto{
    
    email: string    
    code: string
}