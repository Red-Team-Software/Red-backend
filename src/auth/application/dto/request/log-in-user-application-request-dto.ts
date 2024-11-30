import { IServiceRequestDto } from 'src/common/application/services';

export interface LogInUserApplicationRequestDTO extends IServiceRequestDto{
    email: string
    password: string  
}